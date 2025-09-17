<template>
  <div class="trigram-symbol-container">
    <!-- Unicode Symbol (Primary) -->
    <span :class="['trigram-symbol', symbolClasses]" :style="symbolStyle">
      {{ trigramSymbol }}
    </span>
    
    <!-- Visual Fallback (shown if requested or if Unicode fails) -->
    <div v-if="showVisual" class="trigram-visual" :class="visualClasses">
      <div class="trigram-lines">
        <div 
          v-for="(line, index) in lines" 
          :key="index" 
          :class="['line', line ? 'yang' : 'yin']"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrigramSymbol',
  props: {
    binary: {
      type: String,
      required: true,
      validator: (value) => /^[01]{3}$/.test(value)
    },
    trigramSymbol: {
      type: String,
      default: ''
    },
    showVisual: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    lines() {
      // Convert binary string to array of booleans (1 = yang/solid, 0 = yin/broken)
      // Read from bottom to top (traditional I Ching order)
      return this.binary.split('').reverse().map(bit => bit === '1');
    },
    symbolClasses() {
      return {
        [`symbol-${this.size}`]: this.size !== 'normal'
      };
    },
    visualClasses() {
      return {
        [`visual-${this.size}`]: this.size !== 'normal'
      };
    },
    symbolStyle() {
      return this.color ? { color: this.color } : {};
    }
  }
};
</script>

<style scoped>
.trigram-symbol-container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.symbol-large {
  font-size: 2.5rem;
}

.symbol-small {
  font-size: 1.2rem;
}

.visual-large .line {
  height: 5px;
  
  &.yang {
    width: 40px;
  }
  
  &.yin {
    width: 18px;
    
    &:after {
      width: 18px;
      right: -22px;
    }
  }
}

.visual-small .line {
  height: 2px;
  gap: 1px;
  
  &.yang {
    width: 16px;
  }
  
  &.yin {
    width: 7px;
    
    &:after {
      width: 7px;
      right: -9px;
    }
  }
}
</style>
