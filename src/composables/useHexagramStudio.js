import { computed, ref } from 'vue';
import { useHexagramStore } from '@/stores/oracle';
import { useSymphonyStore } from '@/stores/symphony';
import { useToneEngine } from '@/composables/useToneEngine';
import { asHexBinary, mapHexagramVoice } from '@/const/hexagramMusic';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

export function useHexagramStudio() {
  const oracle = useHexagramStore();
  const symphonyStore = useSymphonyStore();
  const engine = useToneEngine();

  const voice = ref('rhythm');
  const source = ref('cast');
  const isPlaying = ref(false);
  const currentItemIndex = ref(-1);
  const currentLineIndex = ref(-1);
  const currentFrequency = ref(0);
  const playbackSpeed = ref(1);
  const progressMessage = ref('');
  const activeHexagram = ref('');
  const activeLines = ref([]);
  const selectedHexBinary = ref('111111');
  const playTransformed = ref(true);
  const sortNewestFirst = ref(true);

  let playGen = 0;
  let pauseRequested = false;
  let resume = null;

  const castItems = computed(() => {
    const list = [...(oracle.consultationHistory || [])];
    list.sort((a, b) => {
      const da = new Date(a.timestamp).getTime();
      const db = new Date(b.timestamp).getTime();
      return sortNewestFirst.value ? db - da : da - db;
    });
    return list
      .map((reading) => {
        const binary = asHexBinary(reading.primaryHexagram)
          || asHexBinary(reading.primaryHexagram?.binary);
        if (!binary) return null;
        return {
          id: reading.id,
          title: reading.question || 'Untitled reading',
          subtitle: reading.timestamp
            ? new Date(reading.timestamp).toLocaleString()
            : '',
          binary,
          transformedBinary: asHexBinary(reading.transformedHexagram)
            || asHexBinary(reading.transformedHexagram?.binary),
          changingLines: reading.changingLines || [],
        };
      })
      .filter(Boolean);
  });

  const lifeItems = computed(() => {
    const timeline = symphonyStore.snapshot?.timeline || [];
    return timeline
      .map((year, index) => {
        const binary = asHexBinary(year.hexagramBinary);
        if (!binary) return null;
        return {
          id: `life-${index}`,
          title: `Age ${year.age}`,
          subtitle: [year.year, year.source].filter(Boolean).join(' · '),
          binary,
          transformedBinary: '',
          changingLines: [],
          age: year.age,
          year: year.year,
        };
      })
      .filter(Boolean);
  });

  const catalogItem = computed(() => {
    const binary = asHexBinary(selectedHexBinary.value);
    if (!binary) return null;
    return {
      id: `hex-${binary}`,
      title: 'Chosen hexagram',
      subtitle: binary,
      binary,
      transformedBinary: '',
      changingLines: [],
    };
  });

  const queue = computed(() => {
    if (source.value === 'life') return lifeItems.value;
    if (source.value === 'hexagram') return catalogItem.value ? [catalogItem.value] : [];
    return castItems.value;
  });

  const currentItem = computed(() => {
    if (currentItemIndex.value < 0) return null;
    return queue.value[currentItemIndex.value] || null;
  });

  const playHexagram = async (binary, changingLines, startLine, gen) => {
    const lines = mapHexagramVoice(binary, voice.value);
    activeLines.value = lines;
    activeHexagram.value = binary;
    for (let i = startLine; i < lines.length; i++) {
      if (gen !== playGen) return 'aborted';
      if (pauseRequested) {
        resume = { ...(resume || {}), line: i };
        return 'paused';
      }
      currentLineIndex.value = i;
      const line = {
        ...lines[i],
        portamento: (changingLines || []).some((n) => Number(n) === i + 1) ? 0.25 : 0,
      };
      const freq = await engine.playLine(line, playbackSpeed.value);
      if (gen !== playGen) return 'aborted';
      currentFrequency.value = freq;
      if (pauseRequested) {
        resume = { ...(resume || {}), line: i };
        return 'paused';
      }
    }
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    return 'done';
  };

  const playQueue = async (items, start = {}) => {
    if (isPlaying.value || !items.length) return;
    const gen = ++playGen;
    pauseRequested = false;
    await engine.ensure();
    isPlaying.value = true;
    const total = items.length;
    let itemIndex = start.itemIndex || 0;
    let phase = start.phase || 'primary';
    let line = start.line || 0;

    try {
      for (; itemIndex < total; itemIndex++) {
        if (gen !== playGen) return;
        const item = items[itemIndex];
        currentItemIndex.value = itemIndex;
        const primary = asHexBinary(item.binary);
        const transformed = playTransformed.value ? asHexBinary(item.transformedBinary) : '';
        if (!primary) {
          line = 0;
          phase = 'primary';
          continue;
        }
        const changeText = transformed && transformed !== primary ? ` → ${transformed}` : '';
        progressMessage.value = `${item.title} (${itemIndex + 1} of ${total})${changeText}`;

        if (phase === 'primary') {
          const result = await playHexagram(primary, item.changingLines || [], line, gen);
          if (result !== 'done') {
            resume = {
              items,
              itemIndex,
              phase: 'primary',
              line: resume?.line || line,
            };
            isPlaying.value = false;
            if (result === 'paused') progressMessage.value = 'Paused';
            return;
          }
          line = 0;
          phase = 'transformed';
        }

        if (transformed && transformed !== primary) {
          await wait(280 / Math.max(0.25, playbackSpeed.value));
          if (gen !== playGen) return;
          if (pauseRequested) {
            resume = { items, itemIndex, phase: 'transformed', line: 0 };
            isPlaying.value = false;
            progressMessage.value = 'Paused';
            return;
          }
          const result = await playHexagram(transformed, [], line, gen);
          if (result !== 'done') {
            resume = {
              items,
              itemIndex,
              phase: 'transformed',
              line: resume?.line || line,
            };
            isPlaying.value = false;
            if (result === 'paused') progressMessage.value = 'Paused';
            return;
          }
        }

        phase = 'primary';
        line = 0;
        await wait(180 / Math.max(0.25, playbackSpeed.value));
      }

      if (gen === playGen) {
        isPlaying.value = false;
        currentLineIndex.value = -1;
        currentFrequency.value = 0;
        resume = null;
        progressMessage.value = total ? 'Playback complete' : 'Nothing to play';
      }
    } catch (e) {
      console.error('Hexagram studio playback error:', e);
      isPlaying.value = false;
      progressMessage.value = 'Error during playback';
    }
  };

  const playAll = async () => {
    if (resume?.items) {
      const saved = resume;
      resume = null;
      await playQueue(saved.items, saved);
      return;
    }
    const items = queue.value;
    if (!items.length) {
      progressMessage.value = source.value === 'life'
        ? 'Generate a Life Symphony first, or load a saved one.'
        : 'No hexagrams to play yet.';
      return;
    }
    await playQueue(items);
  };

  const playOne = async (item) => {
    if (!item) return;
    stop();
    resume = null;
    await playQueue([item]);
  };

  const pause = () => {
    if (!isPlaying.value) return;
    pauseRequested = true;
    engine.silence();
  };

  const stop = () => {
    playGen += 1;
    pauseRequested = false;
    resume = null;
    engine.silence();
    isPlaying.value = false;
    currentLineIndex.value = -1;
    currentFrequency.value = 0;
    progressMessage.value = 'Stopped';
  };

  const setVoice = (id) => {
    if (voice.value === id) return;
    stop();
    voice.value = id;
  };

  return {
    voice,
    source,
    isPlaying,
    currentItemIndex,
    currentLineIndex,
    currentFrequency,
    playbackSpeed,
    volume: engine.volume,
    progressMessage,
    activeHexagram,
    activeLines,
    selectedHexBinary,
    playTransformed,
    sortNewestFirst,
    castItems,
    lifeItems,
    queue,
    currentItem,
    canResume: computed(() => !!resume),
    getWaveform: engine.getWaveform,
    playAll,
    playOne,
    pause,
    stop,
    setVoice,
  };
}
