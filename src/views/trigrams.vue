<template>
  <div class="trigrams-page">
    <!-- Page Header (Inline) -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">Trigrams</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Trigram List</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Trigram Table Card -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="card-title mb-4">Trigram List</h3>
            <div class="table-responsive">
              <vue-good-table
                :columns="fields"
                :rows="trigrams"
                styleClass="vgt-table"
                :search-options="{ enabled: true }"
                :select-options="{ enabled: false, selectOnCheckboxOnly: true }"
                compactMode
                mode="remote"
                ref="refTable"
              >
                <!-- Make the entire row clickable -->
                <template v-slot:table-row="props">
                  <router-link
                    :to="`/trigram_detail?trigram=${props.row.binary}`"
                    tag="tr"
                    class="clickable-row"
                  >
                    <span v-if="props.column.field === 'order'">{{ props.row.order }}</span>
                    <span v-else-if="props.column.field === 'name'">{{ props.row.name }}</span>
                    <span v-else-if="props.column.field === 'symbol'">{{ props.row.symbol }}</span>
                    <span v-else-if="props.column.field === 'trigram'">{{ props.row.trigram }}</span>
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
import { ref, onMounted } from 'vue';
import bagua from '@/const/bagua';
import { VueGoodTable } from 'vue-good-table-next';

export default {
  name: 'Trigrams',
  components: {
    VueGoodTable,
  },
  setup() {
    // Reactive state
    const trigrams = ref([]);
    const fields = ref([
      { field: 'order', label: 'Order', formatFn: (value) => value.toString(), sortable: true },
      { field: 'name', label: 'Name', sortable: true },
      { field: 'symbol', label: 'Symbol', sortable: true },
      { field: 'trigram', label: 'Trigram', sortable: true },
      { field: 'binary', label: 'Binary', sortable: true },
    ]);

    // Methods
    const getData = async () => {
      trigrams.value = bagua.sequence_Gua_OldFamilyOrder();      
    };

    // Lifecycle
    onMounted(() => {
      getData();
    });

    return {
      trigrams,
      fields,
    };
  },
};
</script>

