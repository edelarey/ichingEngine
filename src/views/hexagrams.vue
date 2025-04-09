<template>
    <div class="hexagrams-page">
      <!-- Page Header (Inline) -->
      <header class="bg-light py-3 mb-4">
        <div class="container">
          <h1 class="display-4">Hexagrams</h1>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="/">Home</a></li>
              <li class="breadcrumb-item active" aria-current="page">Hexagram List</li>
            </ol>
          </nav>
        </div>
      </header>

  
      <!-- Hexagram Table Card -->
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 mb-4">
          <div class="card">
            <div class="card-body">
              <div class="table-responsive mb-0">
                <vue-good-table
                  :columns="fields"
                  :rows="hexagrams"
                  styleClass="vgt-table table-bordered"
                  :search-options="{ enabled: true, placeholder: 'Search hexagrams...' }"
                  :select-options="{ enabled: false }"
                  compactMode
                >
                  <!-- Make the entire row clickable -->
                  <template v-slot:table-row="props">
                                <router-link
                                    :to="`/hexagram_detail?hexagram=${props.row.binary}`"
                                    tag="tr"
                                    class="clickable-row"
                                >
                                    <span v-if="props.column.field === 'order'">{{ props.row.order }}</span>
                                    <span v-else-if="props.column.field === 'name'">{{ props.row.name }}</span>
                                    <span v-else-if="props.column.field === 'symbol'">{{ props.row.symbol }}</span>
                                    <span v-else-if="props.column.field === 'hexagram'">{{ props.row.hexagram }}</span>
                                    <span v-else-if="props.column.field === 'binary'">{{ props.row.binary }}</span>
                                </router-link>
                 </template>
               
                </vue-good-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import hexagram from '@/const/hexagram';
  import { VueGoodTable } from 'vue-good-table-next';
  
  export default {
    name: 'Hexagrams',
    components: {
    'vue-good-table': VueGoodTable, // Register the component
  },
    data() {
      return {
        title: 'Hexagrams',
        items: [
          { text: 'Hexagrams' },
          { text: 'Hexagram List', active: true },
        ],
        hexagrams: [],
        fields: [
          { field: 'order', label: 'Order', sortable: true },
          { field: 'name', label: 'Name', sortable: true },
          { field: 'symbol', label: 'Symbol', sortable: true },
          { field: 'hexagram', label: 'Hexagram', sortable: true },
          { field: 'binary', label: 'Binary', sortable: true },
        ],
      };
    },
    methods: {
      getData() {
        this.hexagrams = hexagram.sequence_binary();
      },
    },
    mounted() {
      this.getData();
    },
  };
  </script>
  
