<template>
  <div class="home-page">
    <!-- Page Header (Inline) -->
    <header class="bg-light py-3 mb-4">
      <div class="container">
        <h1 class="display-4">I-Ching Engine</h1>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Home</li>
          </ol>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6 mb-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">I-Ching Engine</h5>
            <p class="card-text">I-Ching Engine allows you to consult the I-Ching (Book of Changes).</p>
            <p class="card-text">Individual & Astrological Consultation are supported.</p>
            <img class="img-fluid gif-image" alt="I-Ching Animation" :src="gifUrl" />        
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Home',
  setup() {
    const gifUrl = ref(require('@/assets/iching.gif'));

    return { gifUrl };
  },
};
</script>

