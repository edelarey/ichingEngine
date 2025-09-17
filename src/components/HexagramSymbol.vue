<template>
  <div class="hexagram-symbol-container">
    <!-- Unicode Symbol (Primary) -->
    <span :class="['hexagram-symbol', symbolClasses]" :style="symbolStyle">
      {{ hexagramSymbol }}
    </span>
    
    <!-- Visual Fallback (shown if requested or if Unicode fails) -->
    <div v-if="showVisual" class="hexagram-visual" :class="visualClasses">
      <div class="hexagram-lines">
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
  name: 'HexagramSymbol',
  props: {
    binary: {
      type: String,
      required: true,
      validator: (value) => /^[01]{6}$/.test(value)
    },
    hexagramSymbol: {
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
.hexagram-symbol-container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.symbol-large {
  font-size: 3.5rem;
}

.symbol-small {
  font-size: 1.5rem;
}

.visual-large .line {
  height: 6px;
  
  &.yang {
    width: 50px;
  }
  
  &.yin {
    width: 22px;
    
    &:after {
      width: 22px;
      right: -26px;
    }
  }
}

.visual-small .line {
  height: 2px;
  gap: 2px;
  
  &.yang {
    width: 20px;
  }
  
  &.yin {
    width: 9px;
    
    &:after {
      width: 9px;
      right: -11px;
    }
  }
}
</style>
