<template>
  <v-row no-gutters>   
    <v-col cols="10">
      <div>
        <v-col cols="12">
          <h2>Digite a localidade do seu problema</h2>       
          <label>
            <gmap-autocomplete
              @place_changed="setPlace"
              :selectFirstOnEnter="true"
              required
            ></gmap-autocomplete>
            <button @click="addMarker">Adicionar</button>
          </label>
        </v-col>
        <v-col cols="12">
        <v-textarea
          v-model="description"
          solo
          value="Descreva o problema da sua localidade"
        ></v-textarea>
        </v-col>
        <br />
      </div>
      <br />
      <GmapMap
        ref="gmap"
        :center="center"
        :zoom="12"
        style="width:100%;  height: 400px;"
      >
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          @click="center = m.position"
        />
        <GmapMarker
          v-if="this.currentPlace"
          label="★"
          :draggable="true"
          :position="{
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng(),
          }"
        />
      </GmapMap>
    </v-col>
    <v-col>
      <ListMarker :markers="markers" />
    </v-col>
  </v-row>
</template>

<script>
// @ is an alias to /src
import ListMarker from "./ListMarker";
export default {
  name: "GoogleMap",
  components: {
    ListMarker,
  },
  data() {
    return {
      description: "",
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      currentPlace: null,
    };
  },

  async mounted() {
    this.geolocate();
    await this.$refs.gmap.$mapPromise.then((map) => {
      map.setOptions({
        minZoom: 2,
        maxZoom: 18,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
      });
    });
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
      this.$refs.gmap.$mapPromise.then((map) => {
        map.panTo(this.currentPlace.geometry.location);
        map.setZoom(15);
      });
    },
    addMarker() {
      if (this.currentPlace) {
        this.markers.push({
          position: {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng(),
          },
          title: this.currentPlace.formatted_address,
          clickable: true,
          description: this.description,
          icon: "https://cdn.vuetifyjs.com/images/profiles/marcus.jpg",
        });
        this.currentPlace = null;
        // const lat = this.markers[0].position.lat;
        // const lng = this.markers[0].position.lng;
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
  },
};
</script>
