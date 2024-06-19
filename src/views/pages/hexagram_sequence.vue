<template>
    <PageHeader :title="title" :items="items" /> 
            <div class="row">
                <div class="col-3">
                    <div class="card" style="background-color:white" >                               
                        <div class="card-body text-center text-black">    
                        <h5 class="card-title">Available Sequences</h5>           
                                    <Multiselect
                                        v-model="chosenSequence"
                                        :options="sequence"
                                        id="idSequence"   
                                        placeholder="Sequence ?" 
                                        :allowEmpty="true"
                                        :multiple="false"
                                        :preselectFirst="true"                                                                    
                                    />    
                        </div>
                    </div>
                </div>  
                <div class="col">
                     <div class="row">
                            <div class="col-2">
                                <div class="card" style="background-color:white" >                               
                                    <div class="card-body text-center text-black">    
                                    <h5 class="card-title">Animate</h5>
                                        <button type="button" id="btnAnimate" class="btn btn-primary" @click="animate()" >Animate</button>                                             
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card" style="background-color:white" >                               
                                    <div class="card-body text-center text-black">    
                                    <h5 class="card-title">Settings</h5>                                       
                                                                            
                                            <div>
                                                <input class="form-check-input" type="checkbox" id="colorCode" name="colorCode" value=false v-model="chkColorCode"  />                       
                                                <label class="form-check-label" for="colorCodeYes">Color Code Hexagrams</label>                        
                                            </div>
                                            <div>
                                                <input class="form-check-input" type="checkbox"  id="showDetail" name="showDetail" value=false v-model="chkShowDetail"/>
                                                <label class="form-check-label" for="showDetail">Hide Hexagram Detail</label>
                                            </div>
                                                                                
                                    </div>
                                </div>
                            </div>
                     </div>
                </div>                                  
            </div>
            <div class="card-deck"> 
                <div v-if="!chkColorCode==true" class="row">            
                    <div v-for='(hexagramLine,indexLine) in state.hexagrams' :key="indexLine">  
                    <div class="row">    
                                <div v-for='(hexagram,index) in hexagramLine' :key="index" class="col">
                                    <div class="card" style="background-color:white" >                               
                                            <div class="card-body text-center text-black">
                                                <span v-if="!chkShowDetail==true">
                                                    <p class="card-text display-6">{{hexagram.name}}</p> 
                                                </span>
                                                    <a  :href="`/hexagram_detail?hexagram=${hexagram.binary}`">
                                                
                                                        <p :style="{color: colorClass}" class="card-text display-1"> {{hexagram.hexagram}} </p>                                  
                                                    </a>
                                                <span v-if="!chkShowDetail==true">
                                                    <p class="card-text display-8">{{hexagram.translation}}</p>
                                                    <p class="card-text display-8">{{hexagram.binary}}</p>
                                                </span>
                                                
                                            </div>
                                            <div class="card-footer">
                                            <span v-if="!chkShowDetail==true">
                                                <p class="card-text display-8 text-center">{{hexagram.order}}</p>
                                            </span>
                                            </div>
                                        
                                    </div>                 
                                </div>
                    
                    </div>
                    </div>
                </div>
                <div v-else>
                    <div v-for='(hexagramLine,indexLine) in state.hexagrams' :key="indexLine">  
                    <div class="row">    
                                <div v-for='(hexagram,index) in hexagramLine' :key="index" class="col">
                                    <div class="card" style="background-color:grey" >                               
                                            <div class="card-body text-center text-white">
                                                <span v-if="!chkShowDetail==true">
                                                    <p class="card-text display-6">{{hexagram.name}}</p> 
                                                </span>
                                                    <a  :href="`/hexagram_detail?hexagram=${hexagram.binary}`">
                                                        <div :style="{color: aboveTrigramColor(hexagram)}" class="card-text display-1"> <span v-text="above(hexagram)"></span> </div>  
                                                        <div :style="{color: belowTrigramColor(hexagram)}" class="card-text display-1"> <span v-text="below(hexagram)"></span> </div>                                  
                                                    </a>
                                                <span v-if="!chkShowDetail==true">
                                                    <p class="card-text display-8">{{hexagram.translation}}</p>
                                                    <p class="card-text display-8">{{hexagram.binary}}</p>
                                                </span>                                                
                                            </div>
                                            <div class="card-footer">
                                            <span v-if="!chkShowDetail==true">
                                                <p class="card-text display-8 text-center">{{hexagram.order}}</p>
                                            </span>
                                            </div>
                                        
                                    </div>                 
                                </div>
                    
                    </div>
                    </div>
                </div>
            </div>
</template>

<script>
import PageHeader from '@/components/page-header'; 
import Multiselect from '@vueform/multiselect';
import { onMounted,ref, reactive, computed, watch } from 'vue';
import hexagram from '@/const/hexagram';
import { Icon } from '@iconify/vue';
import bagua from '@/const/bagua';
import yao from '@/const/yao';
import _ from 'lodash';
export default {
    name: 'hexagrams',
    components: {
       PageHeader, Icon, Multiselect
    },
     setup() {
        
            const title = ref('Hexagram Sequences');
            const platinum = ref('rgb(229, 228, 226)');
            let counter = 1;
            const width = ref(8);
            const height = ref(8);
            const items = ref([
                {
                    text: 'Hexagrams',
                },
                {
                    text: 'Hexagram Sequences',
                    active: true,
                },
            ]);
            var animationTime = null; 
            
            const sequence = ['King Wen', 'Binary', 'Grey Code'];
            let chosenSequence = ref('King Wen');
            let chkColorCode = ref(false);
            let chkShowDetail = ref(false);
            let animating = false;
            
            const animate = () => {
                animating = !animating;
             
                if (animating==true)
                {
                    document.getElementById('btnAnimate').value = 'Animating';
                    // start a timer process and cycle the hexagram sequences
                   animationTime = setInterval(() => {
                        if (counter < 3)
                        {
                            counter++;
                        }
                        else
                        {
                            counter = 1;
                        }
                        chosenSequence.value = sequence[counter-1];
                    }, 2000);
                    
                }
                else
                {
                    // stop the timer
                    document.getElementById('btnAnimate').value = 'Animate';
                    clearInterval(animationTime);
                    animationTime = null;

                }

            }

            const state = reactive({hexagrams: [],
                                   });            
            const above = (hexagram) => {
                 let trigram = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == hexagram.binary.substring(0,3))[0];
                 return trigram.trigram;
                
            };
            const below = (hexagram) => {
                 let trigram = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == hexagram.binary.substring(3,6))[0];
                 return trigram.trigram;
            };  
            
            const aboveTrigramColor = (hexagram) => {
                   if (!_.isEmpty(hexagram))
                    {   
                         let trigram = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == hexagram.binary.substring(0,3))[0];
                        // construct an rgb string from the color property of the trigram
                        // this is used to set the color of the hexagram symbol
                        let rgb = 'rgb(' + trigram.description.color.color[0].toString() + ',' + trigram.description.color.color[1].toString() + ',' + trigram.description.color.color[2].toString()+ ')';                 
                        
                        return rgb;
                    }
                    else
                    {
                        return 'rgb(0,0,0)';
                    }
            };

            const belowTrigramColor = (hexagram) => {
                   if (!_.isEmpty(hexagram))
                    {   
                         let trigram = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == hexagram.binary.substring(3,6))[0];
                        // construct an rgb string from the color property of the trigram
                        // this is used to set the color of the hexagram symbol
                        let rgb = 'rgb(' + trigram.description.color.color[0].toString() + ',' + trigram.description.color.color[1].toString() + ',' + trigram.description.color.color[2].toString()+ ')';                 
                       
                       return rgb;
                    }
                    else
                    {
                        return 'rgb(0,0,0)';
                    }
            };
    
        const format = async(value) => {
         return value.toString();
        };

        const textClass = computed(() => {
                    return "card-text display-1";
                });
        
      
        const colorClass = computed(() => {                          
                    return 'rgb(0,0,0)';                    
                });

        const aboveTranslation = computed(() => {   
                      if (!_.isEmpty(above))
                      {
                         return above.description.translation;                    
                      }
                      else return '';
                });
        const belowTranslation = computed(() => {     
                      if (!_.isEmpty(below))
                      {
                         return below.description.translation;                    
                      }
                      else return '';
                });
        const aboveNature = computed(() => {    
                      if (!_.isEmpty(above))
                      {
                         return above.description.nature;                    
                      }
                      else return '';
                });
        const belowNature = computed(() => {    
                      if (!_.isEmpty(below))
                      {
                         return below.description.nature;                    
                      }
                      else return '';
                });

        const getData = () => {
            switch (chosenSequence.value)
            {
                case 'King Wen':
                    state.hexagrams = _.chunk(hexagram.sequence_kingwen(),8);                 
                    break;
                case 'Binary':           
                    state.hexagrams = _.chunk(hexagram.sequence_binary(),8);
                    break;
                case 'Grey Code':                 
                    state.hexagrams = _.chunk(hexagram.sequence_greycode(),8) || [];
                    break;
                default:
                    state.hexagrams = _.chunk(hexagram.sequence_kingwen(),8);
                    break;
            }   
            return;
        };
        watch(chosenSequence, async (newVal, oldVal) => {       
          getData();
            },
        );
        const showDetail = () => {
         console.log('showHexagramDetail');
        };
        
        onMounted(() => {
            counter=1;
            getData();
            
        });

        return {
            animate,
            chkColorCode,
            chkShowDetail,
            colorClass, 
            above,
            below,          
            aboveTrigramColor, 
            belowTrigramColor,
            aboveTranslation,
            belowTranslation,
            aboveNature,
            belowNature,
            format,
            textClass,
            title,
            items,
            sequence,
            chosenSequence,            
            state,            
            counter,
            width,
            height,
            platinum,
        };
    },
    
};
</script>