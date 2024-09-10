

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
                <div class="card-body center-content" v-else>
                    <h5 class="card-title">Enter Your Birth Date</h5>
                    <div class="col-sm-1">
                    <p :style="{color: colorClass}" class="card-text">
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
                    </p>                  
                    </div> 
                    <br/>
                    <div class="col-sm-3">                  
                        <h3 :style="{color: colorClass}" class="card-text">Latitude</h3> 
                        <p :style="{color: colorClass}" class="card-text"><input v-model="state.latitude" placeholder="0.00 Latitude"/></p>  
                        <h3 :style="{color: colorClass}" class="card-text">Longitude</h3>                     
                        <p :style="{color: colorClass}" class="card-text"><input v-model="state.longitude" placeholder="0.00 Longitude"/></p>  
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row"  v-if="state.cycle">
        <div class="col-sm-12">                   
            <div class="card text-center">  
                <h3 class="card-header">
                Yearly Cycle
                </h3> 
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <div class="card text-center">  
                                
                <div class="card-body" v-if="state.sexagenaryCycle">
                    <h5 class="card-title">Celestital Stem  - {{formatBirthYear}}</h5>
                    <p class="card-text display-3">{{state.sexagenaryCycle.celestialStem.name}}</p>
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.celestialStem.trigram.symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.celestialStem.trigram.trigram}} </p> 
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.sexagenaryCycle.celestialStem.trigram.description.bodyPart}} </p> 
                            <br /><a  :href="`/trigram_detail?trigram=${state.sexagenaryCycle.celestialStem.trigram.binary}`" class="btn btn-primary">Trigram Detail</a>
                    
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
                    <h5 class="card-title">Horary Branch - {{formatBirthYear}}</h5>
                    <p class="card-text display-3">{{state.sexagenaryCycle.horaryBranch.name}}</p>                            
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.horaryBranch.element.trigrams[0].symbol}} {{state.sexagenaryCycle.horaryBranch.element.trigrams[0].trigram}}</p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.sexagenaryCycle.horaryBranch.element.trigrams[1].symbol}} {{state.sexagenaryCycle.horaryBranch.element.trigrams[1].trigram}}</p>  
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.sexagenaryCycle.horaryBranch.element.bodyPart}} </p>                         
                            <br />
                    <a  :href="`/trigram_detail?trigram=${state.sexagenaryCycle.horaryBranch.element.trigrams[0].binary}`" class="btn btn-primary">Upper Trigram Detail</a>
                    &nbsp;
                    <a  :href="`/trigram_detail?trigram=${state.sexagenaryCycle.horaryBranch.element.trigrams[1].binary}`" class="btn btn-primary">Lower Trigram Detail</a>
                </div>
            </div>
        </div>
    </div>   
    <div class="row"  v-if="state.cycle">
        <div class="col-sm-12">                   
            <div class="card text-center">  
                <h3 class="card-header">
                Monthly Cycle
                </h3> 
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-sm-6">
            <div class="card text-center">
                <div class="card-body" v-if="state.birthStemsandBranches">
                    <h5 class="card-title">Celestital Stem - {{formatBirthMonth}}</h5>
                    <p class="card-text display-3">{{state.birthStemsandBranches.celestialStem.name}}</p>
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.birthStemsandBranches.celestialStem.trigram.symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.birthStemsandBranches.celestialStem.trigram.trigram}} </p> 
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.birthStemsandBranches.celestialStem.trigram.description.bodyPart}} </p> 
                            <br />
                            <a  :href="`/trigram_detail?trigram=${state.birthStemsandBranches.celestialStem.trigram.binary}`" class="btn btn-primary">Trigram Detail</a>
                    
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
                <div class="card-body" v-if="state.birthStemsandBranches">
                    <h5 class="card-title">Horary Branch - {{formatBirthMonth}}</h5>
                    <p class="card-text display-3">{{state.birthStemsandBranches.horaryBranch.name}}</p>                            
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.birthStemsandBranches.horaryBranch.element.trigrams[0].symbol}} {{state.birthStemsandBranches.horaryBranch.element.trigrams[0].trigram}}</p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.birthStemsandBranches.horaryBranch.element.trigrams[1].symbol}} {{state.birthStemsandBranches.horaryBranch.element.trigrams[1].trigram}}</p>  
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.birthStemsandBranches.horaryBranch.element.bodyPart}} </p>                         
                            <br />
                    <a  :href="`/trigram_detail?trigram=${state.birthStemsandBranches.horaryBranch.element.trigrams[0].binary}`" class="btn btn-primary">Upper Trigram Detail</a>
                    &nbsp;
                    <a  :href="`/trigram_detail?trigram=${state.birthStemsandBranches.horaryBranch.element.trigrams[1].binary}`" class="btn btn-primary">Lower Trigram Detail</a>
                </div>
            </div>
        </div>
    </div>   

    <div class="row"  v-if="state.cycle">
        <div class="col-sm-12">                   
            <div class="card text-center">  
                <h3 class="card-header">
                Daily Cycle
                </h3> 
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <div class="card text-center">
                <div class="card-body" v-if="state.dailyStemsandBranches">
                    <h5 class="card-title">Celestital Stem - {{formatBirthDay}}</h5>
                    <p class="card-text display-3">{{state.dailyStemsandBranches.celestialStem.name}}</p>
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.dailyStemsandBranches.celestialStem.trigram.symbol}} </p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.dailyStemsandBranches.celestialStem.trigram.trigram}} </p> 
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.dailyStemsandBranches.celestialStem.trigram.description.bodyPart}} </p> 
                            <br />
                            <a  :href="`/trigram_detail?trigram=${state.dailyStemsandBranches.celestialStem.trigram.binary}`" class="btn btn-primary">Trigram Detail</a>
                    
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
                <div class="card-body" v-if="state.dailyStemsandBranches">
                    <h5 class="card-title">Horary Branch - {{formatBirthDay}}</h5>
                    <p class="card-text display-3">{{state.dailyStemsandBranches.horaryBranch.name}}</p>                            
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.dailyStemsandBranches.horaryBranch.element.trigrams[0].symbol}} {{state.dailyStemsandBranches.horaryBranch.element.trigrams[0].trigram}}</p>  
                            <p :style="{color: colorClass}" class="card-text display-1"> {{state.dailyStemsandBranches.horaryBranch.element.trigrams[1].symbol}} {{state.dailyStemsandBranches.horaryBranch.element.trigrams[1].trigram}}</p>  
                            <p :style="{color: colorClass}" class="card-text display-6"> {{state.dailyStemsandBranches.horaryBranch.element.bodyPart}} </p>                         
                            <br />
                    <a  :href="`/trigram_detail?trigram=${state.dailyStemsandBranches.horaryBranch.element.trigrams[0].binary}`" class="btn btn-primary">Upper Trigram Detail</a>
                    &nbsp;
                    <a  :href="`/trigram_detail?trigram=${state.dailyStemsandBranches.horaryBranch.element.trigrams[1].binary}`" class="btn btn-primary">Lower Trigram Detail</a>
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
                    <a  :href="`/hexagram_detail?hexagram=${state.hexagram.binary}`" class="btn btn-primary">Hexagram Detail</a>
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
                    <a  :href="`/hexagram_detail?hexagram=${state.hexagramTransformed.binary}`" class="btn btn-primary">Hexagram Detail</a>
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
                monthlyStemsandBranches: null,
                dailyStemsandBranches: null,
                birthStemsandBranches: null,                       
                lines: [],
                hexagram: [],
                hexagramTransformed: [],
                natalHexagram:'',
                latitude: 51.40864141429926,
                longitude: -0.050956657671912306,
                birthDate: DateTime.fromObject({ year: 1971, month: 3, day: 3, hour: 10, minute:30}).toISO(),
                minDate: DateTime.fromObject({ year: 1, month: 1, day: 1 }).toISO(), // Later on this is the maximun BC Date Minimum Date: April 20, 271821 BC   (use negative year)
                maxDate:  DateTime.fromObject({ year: 275760, month:9, day: 13 }).toISO(),
            });

        const dateTimeFormatSimple = (date) =>  {
        
        if (date) {
            return DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd HH:mm');
        }
    
        return null;
        };
        

        const formatBirthYear = computed(() => {          
            return DateTime.fromJSDate(new Date(state.birthDate)).year;
        });

        const formatBirthMonth = computed(() => {
            const date = new Date(state.birthDate);
            return date.toLocaleString('default', { month: 'long' });
        });

        const formatBirthDay = computed(() => {
            const date = new Date(state.birthDate);
            return DateTime.fromJSDate(date).toFormat('cccc d') + getOrdinalSuffix(date.getDate());
        });

        // Helper function to get the ordinal suffix (st, nd, rd, th)
        function getOrdinalSuffix(day) {
            if (day > 3 && day < 21) return 'th'; // Handles 11th, 12th, 13th
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        }


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
                let theMonth = DateTime.fromJSDate(new Date(state.birthDate)).month;
                let thecycle = astrology.getFullSexagenaryCycle( theYear);
                state.cycle = thecycle;
                console.log(state.cycle);
                
                state.sexagenaryCycle = astrology.getYearSexagenaryCycle(theYear);
                state.dailyStemsandBranches = astrology.getYearSexagenaryDailyCycle(theYear, state.birthDate)
                console.log('Specific Yearly Sexagenary Cycle', state.sexagenaryCycle);                 
                console.log('Specific Daily Sexagenary Cycle', astrology.getYearSexagenaryDailyCycle(theYear, state.birthDate)); 



                state.monthlyStemsandBranches = astrology.getMonthlyStemsAndBranchesForaYear(theYear);
                console.log('Monthly Stems and Branches', state.monthlyStemsandBranches);
                state.birthStemsandBranches = astrology.getMonthlyStemAndBranchForaYear(theYear, theMonth);
                console.log('Birth Stems and Branches', state.birthStemsandBranches);

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
       
        return { dateTimeFormatSimple, title, items, state, textClass, colorClass, format, consult, calcTrueLocalTime, formatBirthMonth, formatBirthYear, formatBirthDay };
}
}
</script>
<style scoped>
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>