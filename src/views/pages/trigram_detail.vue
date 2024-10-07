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
                            <p class="card-text display-5">Body: {{this.bodyPart}} </p> 
                            <p class="card-text display-5">Attribute: {{this.attribute}} </p> 
                            <p class="card-text display-5">State: {{this.state}} </p> 
                            <p class="card-text display-5"><br/> </p>
                            <p class="card-text display-3">{{this.earlierHeavenName}} </p>
                            <p class="card-text display-5">Polarity: {{this.earlierHeavenPolarity.name}} </p>
                            <p class="card-text display-5">Direction: {{this.earlierHeavenDirection}} </p>  
                            <p class="card-text display-5">Number: {{this.earlierHeavenNumber}} </p>
                            <p class="card-text display-5">Season: {{this.earlierHeavenSeason}} </p>
                            <p class="card-text display-5">Relationship: {{this.earlierHeavenRelationship}} </p>
                            <p class="card-text display-5"><br/> </p>
                            <p class="card-text display-3">{{this.laterHeavenName}} </p>
                            <p class="card-text display-5">Polarity: {{this.laterHeavenPolarity.name}} </p>
                            <p class="card-text display-5">Direction: {{this.laterHeavenDirection}} </p>  
                            <p class="card-text display-5">Number: {{this.laterHeavenNumber}} </p>
                            <p class="card-text display-5">Season: {{this.laterHeavenSeason}} </p>
                            <p class="card-text display-5">Relationship: {{this.laterHeavenRelationship}} </p>
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
                earlierHeavenName() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.name;                    
                      }
                      else return '';
                },                
                earlierHeavenDirection() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.direction;                    
                      }
                      else return '';
                },
                earlierHeavenNumber() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.number;                    
                      }
                      else return '';
                },
                earlierHeavenSeason() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.season;                    
                      }
                      else return '';
                },
                earlierHeavenPolarity() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.polarity;                    
                      }
                      else return '';
                },               
                earlierHeavenRelationship() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.relationship;                    
                      }
                      else return '';
                },        
                laterHeavenName() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.laterHeaven.name;                    
                      }
                      else return '';
                },   
                laterHeavenDirection() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.direction;                    
                      }
                      else return '';
                },  
                laterHeavenNumber() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.number;                    
                      }
                      else return '';
                },
                laterHeavenSeason() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.season;                    
                      }
                      else return '';
                },
                laterHeavenPolarity() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.polarity;                    
                      }
                      else return '';
                },
                laterHeavenRelationship() {    
                      if (!_.isEmpty(this.trigram))
                      {
                         return this.trigram.earlierHeaven.relationship;                    
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