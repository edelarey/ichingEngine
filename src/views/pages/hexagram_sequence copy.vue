<template>
    <PageHeader :title="title" :items="items" />  
            <div class="row">       
                <div v-for='hexagram in hexagrams' :key='hexagram.order'>  
                    <div class="card">
                        <div class="card-body text-center">  
                                <h3 class="card-title">Hexagram Detail</h3>
                                <p class="card-text display-3">{{hexagram.name}}</p>
                                <p :style="{color: this.colorClass}" class="card-text display-1"> {{hexagram.symbol}} </p>  
                                <p :style="{color: this.colorClass}" class="card-text display-1"> {{hexagram.hexagram}} </p> 
                                <p :style="{color: this.colorClass}" class="card-text display-5"> {{hexagram.binary}} </p>  
                                <a href="/hexagram_detail?hexagram=${{hexagram.binary}}" class="card-link">Hexagram Detail</a>
                        </div>
                    </div>
                </div>
            </div>
</template>


<script>
import PageHeader from '@/components/page-header'; 
import hexagram from '@/const/hexagram';
import { Icon } from '@iconify/vue';
import bagua from '@/const/bagua';
import yao from '@/const/yao';
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
            
            above:{},
            below:{},
        }
    },
    computed: {
                textClass(){
                    return "card-text display-1";

                },
                aboveColorClass() {                     
                    if (!_.isEmpty(this.above))
                    {   
                        // construct an rgb string from the color property of the trigram
                        // this is used to set the color of the hexagram symbol
                        let rgb = 'rgb(' + this.above.description.color.color[0].toString() + ',' + this.above.description.color.color[1].toString() + ',' + this.above.description.color.color[2].toString()+ ')';                 
                        if (rgb == 'rgb(255,255,255)')
                        {
                            rgb = 'rgb(0,0,0) ';
                        }
                       
                        return rgb;
                    }
                    else
                    {
                        return 'rgb(0,0,0)';
                    }
                },
                 belowColorClass() {                     
                    if (!_.isEmpty(this.below))
                    {   
                        // construct an rgb string from the color property of the trigram
                        // this is used to set the color of the hexagram symbol
                        let rgb = 'rgb(' + this.below.description.color.color[0].toString() + ',' + this.below.description.color.color[1].toString() + ',' + this.below.description.color.color[2].toString()+ ')';                 
                         if (rgb == 'rgb(255,255,255)')
                        {
                            rgb = 'rgb(0,0,0)';
                        }
                        return rgb;
                    }
                    else
                    {
                        return 'rgb(0,0,0)';
                    }
                },
                colorClass() {                     
                    return 'rgb(0,0,0)';                    
                },
                aboveTranslation() {    
                      if (!_.isEmpty(this.above))
                      {
                         return this.above.description.translation;                    
                      }
                      else return '';
                },
                belowTranslation() {    
                      if (!_.isEmpty(this.below))
                      {
                         return this.below.description.translation;                    
                      }
                      else return '';
                },
                aboveNature() {    
                      if (!_.isEmpty(this.above))
                      {
                         return this.above.description.nature;                    
                      }
                      else return '';
                },
                belowNature() {    
                      if (!_.isEmpty(this.below))
                      {
                         return this.below.description.nature;                    
                      }
                      else return '';
                },
            },
     methods: {
         format(value) {
        return value.toString();
        },
         async getData() {            
           this.hexagrams = hexagram.sequence_binary();
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