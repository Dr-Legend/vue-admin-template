<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px">
      <el-input v-model="search" placeholder="Enter name to search" prefix-icon="el-icon-search" />
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="items == null?items:items.filter(data => !search || data.firstName.toLowerCase().includes(search.toLowerCase()))" border fit highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50" align="left" />
      <el-table-column prop="id" label="ID" width="180" align="left" sortable />
      <el-table-column label="Name" width="180" align="left" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.firstName+' '+scope.row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="Phone" align="left" sortable width="180" />
      <el-table-column label="Created" width="180" align="left" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="Email" align="left" sortable />
    </el-table>
  </div>
</template>

<script>
import { getMembers } from '@/api/member'
import { parseTime } from '@/utils'
import waves from '@/directive/waves'
export default {
  filters: {
    parseTime
  },
  directives: { waves },
  data() {
    return {
      items: null,
      listLoading: true,
      tableKey: 0,
      listQuery: {
        name: ''
      },
      search: ''
    }
  },
  created() {
    this.getMembers()
  },
  methods: {
    getMembers() {
      this.listLoading = true
      getMembers().then(response => {
        this.items = response
        console.log(response)
        this.listLoading = false
      })
    }
  }
}
</script>

<style>
</style>
