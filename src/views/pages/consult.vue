

<template>
    <PageHeader :title="title" :items="items" />
    <div class="row">
        <div class="col-sm-6">                   
            <div class="card text-center">
                <div class="card-body" v-if="this.hexagram">
                    <h5 class="card-title">Primary Hexagram</h5>
                    <p class="card-text display-3">{{this.hexagram.name}}</p>
                            <p :style="{color: this.colorClass}" class="card-text display-1"> {{this.hexagram.symbol}} </p>  
                            <p :style="{color: this.colorClass}" class="card-text display-1"> {{this.hexagram.hexagram}} </p> 
                            <p :style="{color: this.colorClass}" class="card-text display-6"> {{this.hexagram.translation}} </p> 
                            <br />
                    <a  :href="`/hexagram_detail?hexagram=${this.hexagram.binary}`" class="btn btn-primary">View Detail</a>
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
                <div class="card-body" v-if="this.hexagramTransformed">
                    <h5 class="card-title">Transformed Hexagram</h5>
                    <p class="card-text display-3">{{this.hexagramTransformed.name}}</p>
                            <p :style="{color: this.colorClass}" class="card-text display-1"> {{this.hexagramTransformed.symbol}} </p>  
                            <p :style="{color: this.colorClass}" class="card-text display-1"> {{this.hexagramTransformed.hexagram}} </p> 
                            <p :style="{color: this.colorClass}" class="card-text display-6"> {{this.hexagramTransformed.translation}} </p> 
                            <br />
                    <a  :href="`/hexagram_detail?hexagram=${this.hexagramTransformed.binary}`" class="btn btn-primary">View Detail</a>
                </div>
            </div>
        </div>
    </div>
<div class="row align-items-center">
        <div class="col">
           <div class="card text-center">
                <button @click="consult" class="btn btn-primary">Generate Hexagrams</button>
           </div>
        </div>
 </div>       
 <div class="row align-items-center">
         <div class="col">    
            <span  class="text-primary" >
                <b-form-group>
                    <label for="dateFilter" class="form-label">Birth Date</label>
                    <Datepicker
                        placeholder="Birth Date"
                        v-model="birthDate"                        
                        format="yyyy-MM-dd HH:mm"
                        previewFormat="yyyy-MM-dd HH:mm"
                        :enableTimePicker="true"                    
                        :disabled="false"                       
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
                <input v-model="latitude" placeholder="0.00"/>
           </div>
        </div>
        <div class="col">
           <div class="card text-center">
                <p>Longitude</p>
                <input v-model="longitude" placeholder="0.00"/>
           </div>
        </div>
 </div>    
 <div class="row align-items-center">
        <div class="col">
           <div class="card text-center">
                <button @click="calcTrueLocalTime" class="btn btn-primary">Calculate Natal Hexagram</button>
           </div>
        </div>
 </div>  
 <div class="row">
        <div class="col">                   
            <div class="card text-center">
                <div class="card-body" v-if="this.hexagram">
                    <h5 class="card-title">Natal Hexagram</h5>
                    <p class="card-text display-3"><span v-html="natalHexagram"></span></p>
                            
                </div>
            </div>
        </div>
</div>    
</template>


<script>
import PageHeader from '@/components/page-header'; 
import hexagram from '@/const/hexagram';
import { bagua } from '@/const/bagua';
import coin from '@/const/coin';
import { Icon } from '@iconify/vue';
import _ from 'lodash';
import { useHexagramStore } from '@/stores/storeHexagram';
import astro from '@/const/astrology';
import { DateTime } from 'luxon';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
const util = require('util');

const hexagramStore = useHexagramStore();

export default {
    name: 'hexagrams',
    components: {
       PageHeader, Icon, Datepicker
    },
    data() 
    {
        return {
            title: 'Consult',
            items: [
                {
                    text: 'Consult',
                },
                {
                    text: 'Consult the I Ching',
                    active: true,
                },
            ],
            lines: [],
            hexagram: [],
            hexagramTransformed: [],
            natalHexagram:'',
            latitude: 51.40864141429926,
            longitude: -0.050956657671912306,
            birthDate: DateTime.now().toISO(),
        }
    },
    computed: {
                textClass(){
                    return "card-text display-1";

                },
                colorClass() {                     
                    return 'rgb(0,0,0)';                    
                },
            },
    methods:
    {
            format(value) {
            return value.toString();
        },
        async consult() {
            // toss a coin and generate the hexagram using imported library const/coin
            let primaryHexagram = coin.generateCoinHexagram();
            let secondaryHexagram = coin.generateSecondaryCoinHexagram(primaryHexagram);
            let primaryBinary = coin.transformCoinHexagramToBinary(primaryHexagram);
            let secondaryBinary = coin.transformCoinHexagramToBinary(secondaryHexagram);
            // Set the displayed hexagram and transformed hexagram
            this.hexagram = hexagram.sequence_binary().filter((item) => item.binary == primaryBinary)[0];
            this.hexagramTransformed = hexagram.sequence_binary().filter((item) => item.binary == secondaryBinary)[0];
            // save to the store using storeHexagram.js
            hexagramStore.setPrimaryHexagram(primaryBinary);
            hexagramStore.setSecondaryHexagram(secondaryBinary);
        
            console.log('primaryHexagram',primaryHexagram);
            console.log('primaryBinary',primaryBinary);
            console.log('secondaryHexagram',secondaryHexagram);
            console.log('secondaryBinary',secondaryBinary); 
        },
        
        async  calcTrueLocalTime() {
            // Example usage
            console.log(`Birth Date:  ${this.birthDate}`);
            const abirthDate = DateTime.fromJSDate(new Date(this.birthDate)).toFormat('yyyy-MM-dd');
            const abirthTime = DateTime.fromJSDate(new Date(this.birthDate)).toFormat('HH:mm');      
                        
          //  51.40864141429926, -0.050956657671912306 - Jaz
          // -26.39654621324616, 27.37685364070206 - Ed

            const localTime = await astro.calculateTrueLocalTime(abirthDate, abirthTime, this.latitude, this.longitude);
             console.log(`True Local Time: ${localTime}`);
            const sexagenaryCycle = await astro.computeSexagenaryCycle(localTime);
            const determineSubCycle = await astro.determineSubCycle(abirthDate, abirthTime);
            const determineNatalHexagram = await astro.calculateNatalHexagram(abirthDate, abirthTime);
            
            this.natalHexagram = determineNatalHexagram.english;
           
            console.log(`Sexagenary Cycle: ${sexagenaryCycle}`);
            console.log(`Sub Cycle: ${determineSubCycle}`);
            console.log(`Natal Hexagram: ${determineNatalHexagram}`);
            console.log(util.inspect(determineNatalHexagram, true, 100, [true]));
            
   
        },

   
    },
     mounted() {
        // start with some defaults
        // Get the previously drawn hexagram from the store      
        this.hexagram = hexagram.getHexagramByBinary(hexagramStore.getPrimaryHexagram);
        this.hexagramTransformed = hexagram.getHexagramByBinary(hexagramStore.getSecondaryHexagram);

    },
};
</script>