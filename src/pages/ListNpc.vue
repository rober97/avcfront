<template>
  <div class="q-pa-md">
    <h2>sdasd</h2>
    <q-table
      grid
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import axios from "axios";
import {useGlobal} from '../stores/global';

const global = useGlobal();


const getListNpc = () => {
  let config = {
        method: "get",
        url: `${this.global.url_api}/get-npc`,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
      let doc = () => {
        return new Promise((resolve, reject) => {
          axios(config)
            .then((r) => {
              resolve(r.data);
            })
            .catch((err) => {
              console.log(err);
              reject();
            });
        });
      };

      Promise.all([doc()]).then((respuestas) => {
        try {
          let data_t = [];
          let data_table = {};
          console.log("DATA MAIN: ", respuestas);
          for (let i = 0; i < respuestas[0].length; i++) {
            data_table = {
              name: respuestas[0][i].nombre,
              relation: respuestas[0][i].relacion,
              world: respuestas[0][i].world,
              hearts: respuestas[0][i].corazones,
            };
            data_t.push(data_table);
          }
          // respuestas.forEach((e) => {
          //   console.log(e);
          //   data_table = {
          //     name: e.nombre,
          //     relation: e.relacion,
          //     world: e.world,
          //   };
          //   data_t.push(data_table);
          // });

          this.desserts = data_t;
        } catch (error) {
          console.log(error);
        }
      });
}



</script>

<style>

</style>