<template>
  <div class="q-pa-md">
    <div class="q-pa-md q-gutter-sm">
      <q-btn round color="primary" icon="shopping_cart" @click="addRow" />
    </div>
    <q-table
      class="my-sticky-header-column-table"
      title="Treats"
      :rows="rows"
      :pagination="initialPagination"
      :columns="columns"
      row-key="name"
      id="mainTable"
    >
      <template v-slot:body="props">
        <tr>
          <td><q-input outlined dense :debounce="300" /></td>
          <td>{{ props.calories }}</td>
        </tr>
      </template>
    </q-table>
  </div>
</template>

<script>
const columns = [
  {
    name: "name",
    required: true,
    label: "Dessert (100g serving)",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "calories",
    align: "center",
    label: "Calories",
    field: "calories",
    sortable: true,
  },
];

const rows = [];

export default {
  setup() {
    return {
      columns,
      rows,
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 14,
        // rowsNumber: xx if getting data from a server
      },
    };
  },

  methods: {
    addRow($event) {
      const table_header =
        document.getElementById("mainTable").childNodes[1].childNodes[0]
          .childNodes[0].childNodes[0];
      const table_body = document
        .getElementById("mainTable")
        .getElementsByTagName("tbody")[0];

      let first_header = table_header.childNodes[0];
      const newNode = document.createElement("th");
      newNode.textContent = "N";

      table_header.insertBefore(newNode, first_header);

      for (let i = 0; i <= 14; i++) {
        const newTr = document.createElement("td");
        newTr.innerHTML = '<input type="text"/>';
        if (table_body.getElementsByTagName("tr")[i] != undefined)
          table_body
            .getElementsByTagName("tr")
            [i].appendChild(
              newTr,
              table_body.getElementsByTagName("tr")[0].childNodes[0]
            );
      }
    },
  },
};
</script>

<style lang="sass">
.my-sticky-header-column-table
  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
</style>