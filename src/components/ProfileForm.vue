<template>
  <div class="profile-form">
    <form @submit.prevent="handleSubmit">
      <!-- Basic Information -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">📝 Basic Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Display Name -->
            <div class="col-md-6 mb-3">
              <label for="displayName" class="form-label">Display Name *</label>
              <input
                type="text"
                class="form-control"
                id="displayName"
                v-model="formData.displayName"
                placeholder="How others will see you"
                required
              />
            </div>
            
            <!-- Full Name -->
            <div class="col-md-6 mb-3">
              <label for="name" class="form-label">Full Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="formData.name"
                placeholder="Your full name (private)"
              />
            </div>
            
            <!-- Gender -->
            <div class="col-md-6 mb-3">
              <label for="gender" class="form-label">Gender *</label>
              <select class="form-select" id="gender" v-model="formData.gender" required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            
            <!-- Birthday -->
            <div class="col-md-6 mb-3">
              <label for="birthday" class="form-label">Birth Date & Time *</label>
              <Datepicker
                v-model="formData.birthday"
                :enableTimePicker="true"
                format="yyyy-MM-dd HH:mm"
                placeholder="Select your birth date and time"
                class="w-100"
                required
              />
              <small class="text-muted">Accurate time improves compatibility calculations</small>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Birth Location -->
      <div class="card mb-4">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0">📍 Birth Location</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Place -->
            <div class="col-12 mb-3">
              <label for="place" class="form-label">Birth Place</label>
              <input
                type="text"
                class="form-control"
                id="place"
                v-model="formData.place"
                placeholder="City, Country"
              />
            </div>
            
            <!-- Latitude -->
            <div class="col-md-6 mb-3">
              <label for="latitude" class="form-label">Latitude</label>
              <input
                type="number"
                class="form-control"
                id="latitude"
                v-model.number="formData.coords.latitude"
                step="any"
                min="-90"
                max="90"
                placeholder="e.g., 31.2304"
              />
            </div>
            
            <!-- Longitude -->
            <div class="col-md-6 mb-3">
              <label for="longitude" class="form-label">Longitude</label>
              <input
                type="number"
                class="form-control"
                id="longitude"
                v-model.number="formData.coords.longitude"
                step="any"
                min="-180"
                max="180"
                placeholder="e.g., 121.4737"
              />
            </div>
          </div>
          <small class="text-muted">
            <a href="https://www.latlong.net/" target="_blank" rel="noopener">Find your coordinates</a>
          </small>
        </div>
      </div>
      
      <!-- About You -->
      <div class="card mb-4">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">💬 About You</h5>
        </div>
        <div class="card-body">
          <!-- Bio -->
          <div class="mb-3">
            <label for="bio" class="form-label">Bio</label>
            <textarea
              class="form-control"
              id="bio"
              v-model="formData.bio"
              rows="4"
              maxlength="500"
              placeholder="Tell others about yourself..."
            ></textarea>
            <small class="text-muted">{{ formData.bio.length }}/500 characters</small>
          </div>
          
          <!-- Interests -->
          <div class="mb-3">
            <label class="form-label">Interests</label>
            <div class="interests-container">
              <div class="interest-tags mb-2">
                <span
                  v-for="interest in formData.interests"
                  :key="interest"
                  class="badge bg-primary me-1 mb-1"
                >
                  {{ interest }}
                  <button
                    type="button"
                    class="btn-close btn-close-white ms-1"
                    @click="removeInterest(interest)"
                    style="font-size: 0.6rem;"
                  ></button>
                </span>
              </div>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  v-model="newInterest"
                  placeholder="Add an interest"
                  @keydown.enter.prevent="addInterest"
                  list="suggested-interests"
                />
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="addInterest"
                >
                  Add
                </button>
              </div>
              <datalist id="suggested-interests">
                <option v-for="interest in suggestedInterests" :key="interest" :value="interest" />
              </datalist>
            </div>
          </div>
          
          <!-- Looking For -->
          <div class="mb-3">
            <label class="form-label">Looking For</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="lookingRomance"
                value="romance"
                v-model="formData.lookingFor"
              />
              <label class="form-check-label" for="lookingRomance">💕 Romance</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="lookingFriendship"
                value="friendship"
                v-model="formData.lookingFor"
              />
              <label class="form-check-label" for="lookingFriendship">🤝 Friendship</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="lookingSpiritual"
                value="spiritual-partner"
                v-model="formData.lookingFor"
              />
              <label class="form-check-label" for="lookingSpiritual">☯ Spiritual Partner</label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Preferences -->
      <div class="card mb-4">
        <div class="card-header bg-warning">
          <h5 class="mb-0">⚙️ Match Preferences</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Gender Preference -->
            <div class="col-md-6 mb-3">
              <label for="genderPreference" class="form-label">Interested In</label>
              <select class="form-select" id="genderPreference" v-model="formData.genderPreference">
                <option value="ANY">Everyone</option>
                <option value="MALE">Men</option>
                <option value="FEMALE">Women</option>
              </select>
            </div>
            
            <!-- Age Range -->
            <div class="col-md-6 mb-3">
              <label class="form-label">Age Range: {{ formData.ageRange.min }} - {{ formData.ageRange.max }}</label>
              <div class="d-flex gap-2 align-items-center">
                <input
                  type="number"
                  class="form-control"
                  v-model.number="formData.ageRange.min"
                  min="18"
                  max="99"
                  style="width: 80px"
                />
                <span>to</span>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="formData.ageRange.max"
                  min="18"
                  max="99"
                  style="width: 80px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Submit Buttons -->
      <div class="d-flex gap-2 justify-content-end">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
          {{ isEditing ? 'Update Profile' : 'Create Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { getAllInterests } from '@/const/sampleProfiles';

export default {
  name: 'ProfileForm',
  components: {
    Datepicker
  },
  props: {
    initialData: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const isSubmitting = ref(false);
    const newInterest = ref('');
    
    const defaultFormData = {
      displayName: '',
      name: '',
      gender: 'MALE',
      birthday: null,
      coords: {
        latitude: 0,
        longitude: 0
      },
      place: '',
      bio: '',
      photos: [],
      avatarIndex: 0,
      interests: [],
      lookingFor: ['romance'],
      ageRange: {
        min: 18,
        max: 99
      },
      genderPreference: 'ANY'
    };
    
    const formData = reactive({ ...defaultFormData });
    
    const suggestedInterests = computed(() => {
      const allInterests = getAllInterests();
      return allInterests.filter(i => !formData.interests.includes(i));
    });
    
    onMounted(() => {
      if (props.initialData) {
        Object.assign(formData, {
          ...defaultFormData,
          ...props.initialData,
          coords: {
            ...defaultFormData.coords,
            ...(props.initialData.coords || {})
          },
          ageRange: {
            ...defaultFormData.ageRange,
            ...(props.initialData.ageRange || {})
          },
          interests: [...(props.initialData.interests || [])],
          lookingFor: [...(props.initialData.lookingFor || ['romance'])]
        });
      }
    });
    
    function addInterest() {
      const interest = newInterest.value.trim();
      if (interest && !formData.interests.includes(interest)) {
        formData.interests.push(interest);
        newInterest.value = '';
      }
    }
    
    function removeInterest(interest) {
      const index = formData.interests.indexOf(interest);
      if (index > -1) {
        formData.interests.splice(index, 1);
      }
    }
    
    async function handleSubmit() {
      if (!formData.displayName || !formData.birthday || !formData.gender) {
        alert('Please fill in all required fields');
        return;
      }
      
      isSubmitting.value = true;
      
      try {
        // Convert birthday to ISO string if it's a Date object
        const submitData = {
          ...formData,
          birthday: formData.birthday instanceof Date 
            ? formData.birthday.toISOString() 
            : formData.birthday,
          name: formData.name || formData.displayName
        };
        
        emit('submit', submitData);
      } catch (error) {
        console.error('Error submitting profile:', error);
        alert('Error saving profile: ' + error.message);
      } finally {
        isSubmitting.value = false;
      }
    }
    
    return {
      formData,
      isSubmitting,
      newInterest,
      suggestedInterests,
      addInterest,
      removeInterest,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.profile-form {
  max-width: 800px;
  margin: 0 auto;
}

.interests-container {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.75rem;
  background: #f8f9fa;
}

.interest-tags {
  min-height: 32px;
}

.btn-close {
  padding: 0;
  background-size: 50%;
}

.card-header h5 {
  font-size: 1rem;
}
</style>
