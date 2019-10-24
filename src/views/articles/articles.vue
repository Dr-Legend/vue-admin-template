<template>
  <div class="app-container" style="padding: 30px;">
    <div class="filter-container" style="margin-bottom: 20px">
      <el-input v-model="search" placeholder="Enter name to search" prefix-icon="el-icon-search" />
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data=" list == null?list:list.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" sortable align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Image" prop="imageUrl" sortable align="center" width="130" :class-name="getSortClass('imageUrl')">
        <template slot-scope="scope">
          <img :src="scope.row.photoUrl" class="pan-img" width="30" height="30">
        </template>
      </el-table-column>
      <el-table-column label="Price" prop="laundryPrice" sortable align="center" width="80" :class-name="getSortClass('laundryPrice')">
        <template slot-scope="scope">
          <span>{{ scope.row.laundryPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" sortable align="left" width="300" :class-name="getSortClass('name')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Comments" prop="comment" sortable align="left" :class-name="getSortClass('comment')">
        <template slot-scope="scope">
          <span>{{ scope.row.comment == undefined ? '-' : scope.row.comment }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Articles',
  pageOfList: [],
  directives: { waves },
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'info',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      items: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      search: '',
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getArticles()
  },
  methods: {
    getArticles() {
      this.listLoading = true
      getArticles().then(response => {
        this.list = response
        // var tempList = this.items.slice(0, this.listQuery.limit)
        // this.list = tempList
        // console.log(this.list)
        // this.total = response.length
        this.listLoading = false
      })
    }, handleFilter() {
      console.log('next called')
      this.listQuery.page = 1
      this.handlePaginationNext()
    },
    handlePaginationNext() {
      this.listLoading = true
      var tempList = this.items.slice(this.listQuery.page * 10, this.listQuery.limit)
      this.list = tempList
      this.listLoading = false
    },
    handlePagination() {
      this.listLoading = true
      var tempList = this.items.slice(this.listQuery.page * 10, this.listQuery.limit)
      this.list = tempList
      this.listLoading = false
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       this.temp.author = 'vue-element-admin'
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Created Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // updateData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
    //       updateArticle(tempData).then(() => {
    //         for (const v of this.list) {
    //           if (v.id === this.temp.id) {
    //             const index = this.list.indexOf(v)
    //             this.list.splice(index, 1, this.temp)
    //             break
    //           }
    //         }
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Update Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    // handleDelete(row) {
    //   this.$notify({
    //     title: 'Success',
    //     message: 'Delete Successfully',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   const index = this.list.indexOf(row)
    //   this.list.splice(index, 1)
    // },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>

<style scoped>
el-table {
  margin: 100px,
}
</style>
