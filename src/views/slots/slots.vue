<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" justify="end">
        <el-col :span="2"><el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate()">Add</el-button></el-col>
      </el-row>
    </div>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" width="50" align="center" />
      <el-table-column prop="id" label="ID" width="180" align="center" sortable />
      <el-table-column prop="type" label="Type" width="180" align="center" sortable />
      <el-table-column prop="startDate" label="Date" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleUpdate( scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete( scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" style="margin-left:50px;">
        <el-form-item v-if="dialogStatus == 'update'" label="Id" prop="id" style="width: 200px">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in slotTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="startDate">
          <el-date-picker v-model="temp.startDate " type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Available Drivers" prop="availableDrivers" style="width: 200px">
          <el-input-number v-model="temp.availableDrivers" :min="1" :max="10" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSlots, updateSlots, addSlots } from '@/api/slot'
import { parseTime } from '@/utils'
export default {
  filters: {
    parseTime
  },
  data() {
    return {
      listLoading: Boolean,
      list: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      slotTypeOptions: [{ key: 1, display_name: 'Standard' }, { key: 2, display_name: 'Vip' }],
      rules: {
        id: [{ type: 'number', required: true, message: 'Id is required', trigger: 'blur' }],
        startDate: [{ type: 'date', required: true, message: 'date is required', trigger: 'change' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        availableDrivers: [{ type: 'number', required: true, message: 'no of Drivers are required', trigger: 'blur' }]
      },
      temp: {
        id: 0,
        type: 1,
        startDate: new Date(),
        availableDrivers: 0
      }
    }
  },
  created() {
    this.getSlots()
  },
  methods: {
    getSlots() {
      this.listLoading = true
      getSlots().then(response => {
        this.list = response
        this.listLoading = false
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    resetTemp() {
      this.temp = {
        id: 0,
        type: 1,
        startDate: new Date(),
        availableDrivers: 0
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addSlots(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.startDate = new Date(this.temp.startDate)
      this.temp.type = this.temp.type === 'standard' ? 1 : 2
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData.startDate)
          tempData.startDate = this.temp.startDate.toISOString()// change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateSlots(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                this.temp.startDate = parseTime(this.temp.startDate)
                this.temp.type = this.temp.type === 1 ? 'standard' : 'Vip'
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
