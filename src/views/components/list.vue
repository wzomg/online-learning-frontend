<template>
  <div class="app-container">
    <el-input v-model="filterText"
              placeholder="Filter keyword"/>
    <el-tree
            ref="tree2"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            class="filter-tree"
            @node-click="handleNodeClick"
    />
  </div>
</template>

<script>

  export default {

    data() {
      return {
        filterText: '',
        treeData: [
          {
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{
                id: 9,
                label: '三级 1-1-1'
              }, {
                id: 10,
                label: '三级 1-1-2'
              }]
            }]
          }, {
            id: 2,
            label: '一级 2',
            children: [{
              id: 5,
              label: 'a'
            }, {
              id: 6,
              label: 'A'
            }]
          }, {
            id: 3,
            label: '一级 3',
            children: [{
              id: 7,
              label: '二级 3-1'
            }, {
              id: 8,
              label: '二级 3-2'
            }]
          }
        ],  //返回所有分类数据
        defaultProps: {
          children: 'children',
          label: 'title'
        }
      }
    },
    created() {
      this.getAllSubjectList()
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
    methods: {
      getAllSubjectList() {
        this.$http.getAllSubject().then(res => {
          if (res.code === 200) {
            // console.log(res.data.subjectList)
            this.treeData = res.data.subjectList
          }
        })
      },
      filterNode(value, data) {
        //value为搜索的内容，data是过滤后得到的列表
        if (!value) return true
        if (!(data && data.title)) return false
        return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      handleNodeClick(data) {
        // console.log(data)
        this.$emit('getSubject', data)
      }
    }
  }
</script>
<style scoped>
</style>
