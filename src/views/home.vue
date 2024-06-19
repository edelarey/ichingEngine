// BEGIN: gif-import

<template>
    <PageHeader :title="title" :items="items" />
    <div class="card">
        <div class="card-body text-center">  
                <h5 class="card-title">I-Ching Engine</h5>
                <p class="card-text">I-Ching Engine allows you to consult the I-Ching (Book of Changes).</p>
                <p class="card-text"> Astrological Consultation is also supported </p>
                <img class="img-fluid"  alt="Gif" :src="gifUrl" />               
                <br />
                 <a href="/hexagrams" class="card-link">Hexagrams</a>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/page-header'; 

export default {
    name: 'Home',
    components: {
        PageHeader,
    },
    data() {
        return {
            title: 'IChing Engine',
            items: [
                {
                    text: 'Home',
                },
                {
                    text: 'IChing Engine',
                    active: true,
                },
            ],
            gifUrl: require('../assets/iching.gif'),
        }
    },
};
</script>

// END: gif-import
