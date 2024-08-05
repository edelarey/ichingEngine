

<template>
    <PageHeader :title="title" :items="items" />
    <div class="row">
        <div class="col-sm-12">                   
            <div class="card text-center">  
                <h3 class="card-header">
                Astrological Hexagrams in the I Ching Sexagenary Cycle
                </h3>                
                <div class="card-body" v-if="state.cycle">               
                    <h5 class="card-title">BirthDate</h5>
                    <p :style="{color: colorClass}" class="card-text display-6"> {{dateTimeFormatSimple (state.birthDate)}} </p>  
                    <h6 class="card-subtitle mb-2 ">Sexagenary Cycle</h6>
                    <p :style="{color: colorClass}" class="card-text display-4"> {{state.cycle.cycleName}} </p>  
                    <p :style="{color: colorClass}" class="card-text display-6"> {{state.cycle.startYear}} - {{state.cycle.endYear}} </p>                
                    <br />
                </div>         
                <div class="card-body" v-else>
                    <h5 class="card-title">Enter Your Birth Date</h5>
                    <p class="card-text"> 
                        <div class="col-sm-3">                      
                            <Datepicker
                                placeholder="Birth Date"
                                v-model="state.birthDate"                        
                                format="yyyy-MM-dd HH:mm"
                                previewFormat="yyyy-MM-dd HH:mm"
                                :enableTimePicker="true"                    
                                :disabled="false"      
                                :min-date="state.minDate"
                                :max-date="state.maxDate"                                           
                            >
                            </Datepicker>
                        </div>
                    </p>                     
                    <h3 :style="{color: colorClass}" class="card-text">Latitude</h3> 
                    <p :style="{color: colorClass}" class="card-text"><input v-model="state.latitude" placeholder="0.00 Latitude"/></p>  
                    <h3 :style="{color: colorClass}" class="card-text">Longitude</h3>                     
                    <p :style="{color: colorClass}" class="card-text"><input v-model="state.longitude" placeholder="0.00 Longitude"/></p>  
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="card text-center">
                <div class="card-body" v-if="state.sexagenaryCycle">
                    <h5 class="card-title">Celestital Stem</h5>
                    <p class="card-text display-3">{{state.sexagenaryCycle.celestialStem.name}}</p>
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.celestialStem.trigram.symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.celestialStem.trigram.trigram}} </p> 
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.sexagenaryCycle.celestialStem.trigram.description.bodyPart}} </p> 
                            <br />                    <a  :href="`/hexagram_detail?hexagram=${state.hexagram.binary}`" class="btn btn-primary">View Detail</a>
                    
                </div>
            </div>
        </div>
        <!-- <div class="col-sm-2 mt-auto">
            <div class="card text-center">
                <div class="card-body">
                <p class="card-text display-1">→</p>
                </div>
            </div>    
        </div> -->
        <div class="col-sm-6">
            <div class="card text-center">
                <div class="card-body" v-if="state.sexagenaryCycle">
                    <h5 class="card-title">Horary Branch</h5>
                    <p class="card-text display-3">{{state.sexagenaryCycle.horaryBranch.name}}</p>                            
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.horaryBranch.element.trigrams[0].symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.horaryBranch.element.trigrams[1].symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.sexagenaryCycle.horaryBranch.element.bodyPart}} </p>                         
                            <br />
                    <a  :href="`/hexagram_detail?hexagram=${state.hexagramTransformed.binary}`" class="btn btn-primary">View Detail</a>
                </div>
            </div>
        </div>
    </div>   
    <div class="row">
        <div class="col-sm-6">                   
            <div class="card text-center">
                <div class="card-body" v-if="state.hexagram">
                    <h5 class="card-title">Natal Hexagram</h5>
                    <p class="card-text display-3">{{state.hexagram.name}}</p>
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.hexagram.symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.hexagram.hexagram}} </p> 
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.hexagram.translation}} </p> 
                            <br />
                    <a  :href="`/hexagram_detail?hexagram=${state.hexagram.binary}`" class="btn btn-primary">View Detail</a>
                </div>
            </div>
        </div>
        <!-- <div class="col-sm-2 mt-auto">
            <div class="card text-center">
                <div class="card-body">
                <p class="card-text display-1">→</p>
                </div>
            </div>    
        </div> -->
        <div class="col-sm-6">
            <div class="card text-center">
                <div class="card-body" v-if="state.hexagramTransformed">
                    <h5 class="card-title">Transformed Natal Hexagram</h5>
                    <p class="card-text display-3">{{state.hexagramTransformed.name}}</p>
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.hexagramTransformed.symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.hexagramTransformed.hexagram}} </p> 
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.hexagramTransformed.translation}} </p> 
                            <br />
                    <a  :href="`/hexagram_detail?hexagram=${state.hexagramTransformed.binary}`" class="btn btn-primary">View Detail</a>
                </div>
            </div>
        </div>
    </div>   
 <div class="row align-items-center">
         <div class="col-sm-6">    
            <span  class="text-primary" >
                <b-form-group>
                    <label for="dateFilter" class="form-label">Birth Date</label>
                    <Datepicker
                        placeholder="Birth Date"
                        v-model="state.birthDate"                        
                        format="yyyy-MM-dd HH:mm"
                        previewFormat="yyyy-MM-dd HH:mm"
                        :enableTimePicker="true"                    
                        :disabled="false"      
                        :min-date="state.minDate"
                        :max-date="state.maxDate"    
                        text-input             
                    >
                    </Datepicker>
                </b-form-group>
            </span>            
        </div>
 </div>  
  <div class="row align-items-center">
       
        <div class="col">
           <div class="card text-center">
                <p>Latitude</p>
                <input v-model="state.latitude" placeholder="0.00"/>
           </div>
        </div>
        <div class="col">
           <div class="card text-center">
                <p>Longitude</p>
                <input v-model="state.longitude" placeholder="0.00"/>
           </div>
        </div>
 </div>    
 <div class="row align-items-center">
        <div class="col">
           <div class="card text-center">
                <button @click="calcTrueLocalTime()" class="btn btn-primary">Calculate Natal Hexagram</button>
           </div>
        </div>
 </div>  
 <div class="row">
        <div class="col">                   
            <div class="card text-center">
                <div class="card-body" v-if="state.hexagram">
                    <h5 class="card-title">Natal Hexagram</h5>
                    <p class="card-text display-3"><span v-html="state.natalHexagram"></span></p>
                            
                </div>
            </div>
        </div>
</div>    
</template>


<script>
import PageHeader from '@/components/page-header'; 
import hexagram from '@/const/hexagram';
import  bagua  from '@/const/bagua';
import coin from '@/const/coin';
import { Icon } from '@iconify/vue';
import _ from 'lodash';
import { useHexagramStore } from '@/stores/storeHexagram';
import astro from '@/const/astrology';
import { DateTime } from 'luxon';
import Datepicker from '@vuepic/vue-datepicker';
import { reactive, computed, ref, onMounted } from 'vue';
import '@vuepic/vue-datepicker/dist/main.css';
const util = require('util');

const hexagramStore = useHexagramStore();

export default {
    name: 'hexagrams',
    components: {
       PageHeader, Icon, Datepicker
    },
    setup() {
   

            const title = ref('Astrology');
                                
                const items = ref([
                    {
                        text: 'Astrology',
                    },
                    {
                        text: 'Astrology of the I Ching',
                        active: true,
                    },
                ]);
             const state = reactive({
                cycle: null,
                sexagenaryCycle: null,            
                lines: [],
                hexagram: [],
                hexagramTransformed: [],
                natalHexagram:'',
                latitude: 51.40864141429926,
                longitude: -0.050956657671912306,
                birthDate: DateTime.now().toISO(),
                minDate: DateTime.fromObject({ year: 1, month: 1, day: 1 }).toISO(), // Later on this is the maximun BC Date Minimum Date: April 20, 271821 BC   (use negative year)
                maxDate:  DateTime.fromObject({ year: 275760, month:9, day: 13 }).toISO(),
            });

        const dateTimeFormatSimple = (date) =>  {
        
        if (date) {
            return DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd HH:mm');
        }
    
        return null;
        };


            const textClass = computed (() => {
                    return "card-text display-1";

                });

           const colorClass= computed (() => {                    
                    return 'rgb(0,0,0)';                    
                });
            
            const format = (value) => {
            return value.toString();
            };
            const consult = async () => {

                console.log('Consulting the I Ching');
        
            // toss a coin and generate the hexagram using imported library const/coin
            let primaryHexagram = coin.generateCoinHexagram();
            let secondaryHexagram = coin.generateSecondaryCoinHexagram(primaryHexagram);
            let primaryBinary = coin.transformCoinHexagramToBinary(primaryHexagram);
            let secondaryBinary = coin.transformCoinHexagramToBinary(secondaryHexagram);
            // Set the displayed hexagram and transformed hexagram
            state.hexagram = hexagram.sequence_binary().filter((item) => item.binary == primaryBinary)[0];
            state.hexagramTransformed = hexagram.sequence_binary().filter((item) => item.binary == secondaryBinary)[0];
            // save to the store using storeHexagram.js
            hexagramStore.setPrimaryHexagram(primaryBinary);
            hexagramStore.setSecondaryHexagram(secondaryBinary);
        
            console.log('primaryHexagram',primaryHexagram);
            console.log('primaryBinary',primaryBinary);
            console.log('secondaryHexagram',secondaryHexagram);
            console.log('secondaryBinary',secondaryBinary); 
        };
        const mapAstroHexagram = () => {
            
            // loop through astrological hexagrams contain in astro
            // find the hexagram that contains the stripped word
            let countFound =0;
            let countNotFound =0;

            _.forEach(astro.hexagramAstrology, (item) => {
                const firstBracket = item.english.indexOf('(');
                const lastBracket = item.english.indexOf(')');            
                const strippedWord = item.english.substring(firstBracket+1, lastBracket);
                const thehexagram = hexagram.sequence_binary().filter((item) => _.includes(item.translation,strippedWord));
                console.log('Stripped Word', strippedWord);
                if (thehexagram.length > 0)
                {
                    //state.hexagram = thehexagram[0];
                    console.log('The Hexagram', thehexagram[0].translation);
                    countFound++;
                }
                else
                {
                    console.log('The Hexagram', 'Not Found');
                    countNotFound++;
                }                   
            });
             console.log('count found', countFound, 'count not found', countNotFound);
            
        };
        const  calcTrueLocalTime = async() => {

            const astrology = new astro.IChingAstrology();
           
            // console.log('stems', astrology.getAllCelestialStems());
            // console.log('branches', astrology.getAllHoraryBranches());
            // console.log('sexagenary cycles', astrology.getAllSexagenaryCycles());
            
            // console.log('getUpperCycle', astrology.getUpperCycle());
            // console.log('getMiddleCycle', astrology.getMiddleCycle());            
            // console.log('getLowerCycle', astrology.getLowerCycle());
              
                // Examples
                // get the year from the birthdate
                console.log('Min and Max Date', state.minDate, state.maxDate);
                let theYear = DateTime.fromJSDate(new Date(state.birthDate)).year;
                let thecycle = astrology.getFullSexagenaryCycle( theYear);
                state.cycle = thecycle;
                console.log(state.cycle);
                console.log(astrology.getFullSexagenaryCycle(theYear)); // { cycle: "upper", startYear: 1804, endYear: 1863, year: 1820 }
                state.sexagenaryCycle = astrology.getYearSexagenaryCycle(theYear).cycle;
                console.log(state.sexagenaryCycle); 
                // console.log(astrology.getFullSexagenaryCycle(1867)); // { cycle: "upper", startYear: 1804, endYear: 1863, year: 1820 }
                // console.log(astrology.getFullSexagenaryCycle(1900)); // { cycle: "upper", startYear: 1864, endYear: 1923, year: 1900 }
                // console.log(astrology.getFullSexagenaryCycle(1950)); // { cycle: "middle", startYear: 1924, endYear: 1983, year: 1950 }
                // console.log(astrology.getFullSexagenaryCycle(2000)); // { cycle: "lower", startYear: 1984, endYear: 2043, year: 2000 }
                // console.log(astrology.getFullSexagenaryCycle(2100)); // { cycle: "upper", startYear: 2044, endYear: 2103, year: 2100 }
            

            //const astrology2 = new astro.IChingAstrologyManual();
            // const stems = astrology.getAllCelestialStems();
            //console.log('sexagenary cycles', astrology2.getAllSexagenaryCycles());




         //   mapAstroHexagram();
            // Example usage
        //     console.log(`Birth Date:  ${state.birthDate}`);
        
        //     console.log(`Lat: ${state.latitude} Lng: ${state.longitude} `);
        //     const abirthDate = DateTime.fromJSDate(new Date(state.birthDate)).toFormat('yyyy-MM-dd');
        //     const abirthTime = DateTime.fromJSDate(new Date(state.birthDate)).toFormat('HH:mm');      
                        
        //   //  51.40864141429926, -0.050956657671912306 - Jaz
        //   // -26.39654621324616, 27.37685364070206 - Ed
        //   // -26.09910122550391, 28.229700020645936 -Alex

        //     const localTime = await astro.calculateTrueLocalTime(abirthDate, abirthTime, state.latitude, state.longitude);
        //          console.log(`True Local Time: ${localTime}`);
        //     const sexagenaryCycle = await astro.computeSexagenaryCycle(localTime);
        //     const determineSubCycle = await astro.determineSubCycle(abirthDate, abirthTime);
        //     const determineNatalHexagram = await astro.calculateNatalHexagram(abirthDate, abirthTime);
        //     const firstBracket = determineNatalHexagram.english.indexOf('(');
        //     const lastBracket = determineNatalHexagram.english.indexOf(')');            
        //     const strippedWord = determineNatalHexagram.english.substring(firstBracket+1, lastBracket);
        //     console.log(`Stripped Word: ${strippedWord}`);
        //     state.natalHexagram = determineNatalHexagram.english;
        //     const thehexagram = hexagram.sequence_binary().filter((item) => _.includes(item.translation,strippedWord));
        //     if (thehexagram.length > 0)
        //     {
        //         state.hexagram = thehexagram[0];
        //     }
        //     else
        //     {
        //         console.log('The Hexagram', 'Not Found');
        //     }   
        //     console.log('The Hexagram', util.inspect(thehexagram, true, 100, [true]));


            

           
            // console.log(`Sexagenary Cycle: ${sexagenaryCycle}`);
            // console.log(`Sub Cycle: ${determineSubCycle}`);
            // console.log(`Natal Hexagram: ${determineNatalHexagram}`);
            // console.log(util.inspect(determineNatalHexagram, true, 100, [true]));
            
   
        };

        onMounted( async() => {    
              state.hexagram = hexagram.getHexagramByBinary(hexagramStore.getPrimaryHexagram);
              state.hexagramTransformed = hexagram.getHexagramByBinary(hexagramStore.getSecondaryHexagram);  
        });
       
        return { dateTimeFormatSimple, title, items, state, textClass, colorClass, format, consult, calcTrueLocalTime };
}
}
</script>