<template>
    <PageHeader :title="title" :items="items" />            
             <div class="card">
                    <div class="card-body text-center">  
                            <h3 class="card-title">Hexagram Detail</h3>
                            <p class="card-text display-3">{{this.hexagram.name}}</p>
                            <p :style="{color: this.colorClass}" class="card-text display-1"> {{this.hexagram.symbol}} </p>  
                            <p :style="{color: this.colorClass}" class="card-text display-1"> {{this.hexagram.hexagram}} </p> 
                            <p :style="{color: this.colorClass}" class="card-text display-5"> {{this.hexagram.translation}} </p>
                            <p :style="{color: this.colorClass}" class="card-text display-6"> {{this.hexagram.binary}} </p> 
                            <h5 class="card-title">Above</h5>  
                            <p class="card-text display-3">{{this.above.name}}</p>                            
                            <p :style="{color: this.aboveColorClass}" class="card-text display-3"> {{this.above.trigram}} </p> 
                            <p class="card-text display-5">{{this.aboveNature}} : {{this.aboveTranslation}}</p> 
                            <h5 class="card-title">Below</h5>                                                                                    
                            <p class="card-text display-3">{{this.below.name}}</p> 
                            <p :style="{color: this.belowColorClass}" class="card-text display-3"> {{this.below.trigram}} </p>
                            <p class="card-text display-5">{{this.belowNature}} : {{this.belowTranslation}}</p>                             
                            <br />
                           
                            <a href="/hexagrams" class="card-link">Hexagrams</a>
                    </div>
                     <span v-if="this.hexagram.explanation" >
                        <div class="card-body">
                                <h3 class="card-title">Explanation</h3>
                                <p class="card-text display-10"><span v-html="hexagram.explanation"></span></p>   
                        </div>
                    </span>
                    <span v-if="this.hexagram.image">
                        <div class="card-body">
                                <h3 class="card-title">Image</h3>
                                <p class="card-text display-10">{{this.hexagram.image}}</p>   
                        </div>
                    </span>
                     <span v-if="this.hexagram.judgement">
                        <div class="card-body">
                                <h3 class="card-title">The Judgement</h3>
                                <p class="card-text display-10"><span v-html="hexagram.judgement"></span></p>   
                        </div>
                     </span>
                     <span v-if="this.hexagram.lines">
                        <div class="card-body ">
                                <h3 class="card-title">The Lines</h3>
                                <p class="card-text text-break display-10"><span v-html="hexagram.lines"></span></p>   
                        </div>
                        <p class="text-break"></p>
                    </span>
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
            hexagram: {},
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
            this.hexagram = hexagram.sequence_binary().filter((item) => item.binary == this.$route.query.hexagram)[0];
            console.log(this.hexagram);
            //get the applicable trigrams by splitting the binary propery and filtering the trigrams to find a matching binary property
            //this.above = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == this.hexagram.binary.substring(0,3))[0];
            //this.below = await bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == this.hexagram.binary.substring(3,6))[0];
            this.above = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == this.hexagram.binary.substring(0,3))[0];
            this.below = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == this.hexagram.binary.substring(3,6))[0];
            console.log('trigrams',this.above.description.color.color[0].toString(), this.below.description.color);

            
            // console.log('hexagram-kingwen:\n',hexagram.sequence_kingwen(),hexagram.sequence_kingwen().length);
            // console.log('hexagrams:\n',hexagram.sequence());
            // console.log('bagua',_.sortBy(bagua.bagua, ['order'], ['asc']));
            // console.log('bagua oldfamily',bagua.sequence_Gua_OldFamilyOrder());
            // console.log('yao',yao.yao.yin);
        },
     },
    
      mounted() {
      this.getData();
      
    },
};
</script>