
/* eslint-disable */
<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="items"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Type"
        prop="type"
        sortable="custom"
        align="center"
        width="80"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="PickupSlot"
        prop="pickupSlot"
        sortable="custom"
        align="center"
        width="140"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.pickupSlot.startDate | parseTime('{d}/{m}/{y} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Address"
        prop="address"
        sortable="custom"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.address.formattedAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Member"
        prop="address"
        sortable="custom"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.member.firstName +' '+ scope.row.member.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleAssign( scope.row)">
            <span> <svg-icon icon-class="delivery" /></span> Assign</el-button>
          <el-button size="mini" type="warning" @click="handlePenalty( scope.row)">
            <span> <svg-icon icon-class="hand" /></span> penalty</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="400px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" style="margin-left:50px;">
        <el-form-item label="Mission Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in orderMissionTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Order Id" prop="orderId" style="width: 200px">
          <el-input v-model="temp.orderId " type="number" placeholder="Please enter order id" />
        </el-form-item>
        <el-form-item label="Driver Id" prop="driverId" style="width: 200px">
          <el-input v-model="temp.driverId" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="assignOrder">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, applyPenalty, assignOrder } from '@/api/order'
import { parseTime } from '@/utils'
import { MessageBox } from 'element-ui'
export default {
  filters: {
    parseTime
  },
  data() {
    return {
      items: null,
      dialogTitle: 'Assign Order',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        type: undefined,
        orderId: undefined,
        driverId: undefined
      },
      orderMissionTypeOptions: [{ key: 'pickup', display_name: 'Pickup' }, { key: 'delivery', display_name: 'Delivery' }],
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
        orderId: [{ required: true, message: 'Order id is required', trigger: 'blur' }],
        driverId: [{ required: true, message: 'Driver id is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    getOrders() {
      this.listLoading = true
      getOrders().then(response => {
        this.items = response
        var tempList = this.items.slice(0, this.listQuery.limit)
        this.list = tempList
        console.log(this.list)
        this.total = response.length
        this.listLoading = false
      })
    },
    handlePenalty(row) {
      MessageBox.confirm('Are you sure to appy penalty to this order? ', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.applyPenalty(row.id)
      }).catch(() => {
        console.log('canceled')
      })
    },
    handleAssign(row) {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    assignOrder() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          assignOrder(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Order Successfully Assign to Driver',
              type: 'success',
              duration: 5000
            })
          }).catch(() => {
            this.dialogFormVisible = false
          })
        }
      })
    },
    applyPenalty() {
      applyPenalty(this.temp).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
