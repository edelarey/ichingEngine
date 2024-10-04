<template>
    <PageHeader :title="title" :items="items" />            
             <div class="card">
                    <div class="card-body text-center">  
                            <h3 class="card-title">Trigram Detail</h3>
                            <p class="card-text display-3">{{this.trigram.name}}</p>
                            <p class="card-text display-1"> {{this.trigram.symbol}} </p>  
                            <p id="trigram" :style="{color: this.colorClass}" class="card-text display-1"> {{this.trigram.trigram}} </p>                            
                            <p class="card-text display-5">Binary: {{this.trigram.binary}} </p>                             
                            <p class="card-text display-5">Nature: {{this.nature}} : {{this.translation}}</p> 
                            <p class="card-text display-5">Animal: {{this.animal}} </p>  
                            <p class="card-text display-5">Ealier Heaven Direction: {{this.earlierHeavenDirection}} </p>  
                            <p class="card-text display-5">Old Family Direction: {{this.oldfamilydirection}} </p> 
                            <p class="card-text display-5">Old Family Relationship: {{this.oldfamilyrelationship}} </p> 
                            <p class="card-text display-5">New Family Relationship: {{this.newfamilyrelationship}} </p> 
                            <p class="card-text display-5">BodyPart: {{this.bodyPart}} </p> 
                            <p class="card-text display-5">Attribute: {{this.attribute}} </p> 
                            <p class="card-text display-5">State: {{this.state}} </p> 
                                                     
                            <br />
                            <a href="/trigrams" class="card-link">Trigrams</a>
                    </div>
            </div>
</template>


<script>
import PageHeader from '@/components/page-header'; 
import { Icon } from '@iconify/vue';
import bagua from '@/const/bagua';
import _ from 'lodash';
export default {
    name: 'trigrams',
    components: {
       PageHeader, Icon,
    },
     data() {
        return {
            title: 'Trigrams',
            items: [
                {
                    text: 'Trigrams',
                },
                {
                    text: 'Trigrams List',
                    active: true,
                },
            ],
            trigram: {},
        }
    },
    computed: {
             textClass(){
                    return "card-text display-1";
                },
                colorClass() {                     
                    if (!_.isEmpty(this.trigram))
                    {   
                        // construct an rgb string from the color property of the trigram
                        // this is used to set the color of the hexagram symbol
                        let rgb = 'rgb(' + this.trigram.description.color.color[0].toString() + ',' + this.trigram.description.color.color[1].toString() + ',' + this.trigram.description.color.color[2].toString()+ ')';                 
                        if (rgb == 'rgb(255,255,255)')
                        {
                            //text-white bg-dark
                            let newclass = 'card-text display-1 text-white bg-dark';
                            var element = document.getElementById("trigram");
                            // now replace the class with the newclass
                            element.className = newclass;                            
                        }                       
                        return rgb;
                    }
                    else
                    {
                        return 'rgb(0,0,0)';
                    }
                },
                translation() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.translation;                    
                      }
                      else return '';
                },
                 nature() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.nature;                    
                      }
                      else return '';
                },
                earlierHeavenDirection() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.earlierHeavenDirection;                    
                      }
                      else return '';
                },
                earlierHeavenSeason() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.earlierHeavenSeason;                    
                      }
                      else return '';
                },
                oldfamilydirection() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.oldfamilydirection;                    
                      }
                      else return '';
                },
                oldfamilyrelationship() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.oldfamilyrelationship;                    
                      }
                      else return '';
                },
                newfamilyrelationship() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.newfamilyrelationship;                    
                      }
                      else return '';
                },
                bodyPart() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.bodyPart;                    
                      }
                      else return '';
                },
                attribute() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.attribute;                    
                      }
                      else return '';
                },
                state() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.state;                    
                      }
                      else return '';
                },
                animal() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.description.animal;                    
                      }
                      else return '';
                },           
                
            },
     methods: {
    format(value) {
      return value.toString();
    },
    async getData() {            
           
            //get the applicable trigrams by splitting the binary propery and filtering the trigrams to find a matching binary property
            //this.above = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == this.hexagram.binary.substring(0,3))[0];
            //this.below = await bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == this.hexagram.binary.substring(3,6))[0];
            this.trigram = bagua.sequence_Gua_OldFamilyOrder().filter((item) => item.binary == this.$route.query.trigram)[0];
            
            console.log('trigram',this.trigram);
            
            
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