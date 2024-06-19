

<template>
    <PageHeader :title="title" :items="items" />
             <div class="card">
                <div class="card-body">
                <div class="table-responsive mb-0">
                        <vue-good-table
                            :columns="fields"
                            :rows="hexagrams"
                            styleClass="vgt-table"
                            :search-options="{
                                enabled: true,                                
                            }"
                            :select-options="{ enabled:false, selectOnCheckboxOnly: true }"                            
                            compactMode
                            mode="remote"
                            ref="refTable"                            
                        >
                            <template v-slot:table-row="props">
                                <router-link
                                    v-if="props.column.field === 'actions'"                                 
                                    class="px-2 text-primary"           
                                    :to="`/hexagram_detail?hexagram=${props.row.binary}`"
                                >
                          
                                <Icon icon="uil:palette" height="36"  color="green" />                              
                                </router-link>
                            </template>
                        </vue-good-table>
                    </div>
                </div>
             </div>  
</template>


<script>
import PageHeader from '@/components/page-header'; 
import hexagram from '@/const/hexagram';
import { Icon } from '@iconify/vue';
import _ from 'lodash';
export default {
    name: 'hexagrams',
    components: {
       PageHeader, Icon,
    },
     data() {
        return {
            title: 'Hexagrams',
            items: [
                {
                    text: 'Hexagrams',
                },
                {
                    text: 'Hexagram List',
                    active: true,
                },
            ],
            hexagrams: [],
            fields: [   
                { field: 'order', label: 'Order',  formatFn: this.format, sortable: true },             
                { field: 'name', label: 'Name', sortable: true },
                { field: 'symbol', label: 'Symbol', sortable: true },
                { field: 'hexagram', label: 'Hexagram', sortable: true },
                { field: 'binary', label: 'Binary', sortable: true },
                { field: 'actions', label: 'Hexagram Detail', sortable: false },
            ],
        }
    },
     methods: {
    format(value) {
      return value.toString();
    },
    getData() {            
            this.hexagrams = hexagram.sequence_binary();
            console.log('hexagram:\n',this.hexagrams);
            // console.log('hexagram-kingwen:\n',hexagram.sequence_kingwen(),hexagram.sequence_kingwen().length);
            // console.log('hexagrams:\n',hexagram.sequence());
            // console.log('bagua',_.sortBy(bagua.bagua, ['order'], ['asc']));
            // console.log('bagua oldfamily',bagua.sequence_Gua_OldFamilyOrder());
            // console.log('yao',yao.yao.yin);
        },
     },
     showDetail(){
         console.log('showHexagramDetail');
     },
      mounted() {
      this.getData();
      
    },
};
</script>