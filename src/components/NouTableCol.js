export default {
  name: 'NouTableCol',
  props: {
    label: {
      type: String,
      require: true,
    },
    prop: {
      type: String,
      require: false,
    },
    width: {
      type: String,
      require: false,
      default: 'auto',
    },
    formatter: {
      type: Function,
      require: false,
      default: (val) => val,
    },
  },
  computed: {
    parentTable() {
      let table = this.$parent;
      while (table && table.$options.name !== 'NouTable') {
        table = table.$parent;
      }
      return table;
    },
  },
  data() {
    return {
      col: null,
      children: [],
    };
  },
  methods: {
    // 设置当前列对象
    setCol() {
      this.col = {
        id: `${Date.now()}${Math.random()}`,
        label: this.label,
        prop: this.prop,
        render: this.$scopedSlots.default || null,
        width: this.width,
        formatter: this.formatter,
      };
    },
    // 将列加入到所属表格
    addCol() {
      if (!this.parentTable) {
        throw new Error('parent table not exist');
      }
      this.parentTable.cols.push(this.col);
    },
    // 设置当前表头对象
    setHeader() {
      this.header = {
        id: `${Date.now()}${Math.random()}`,
        label: this.label,
        width: this.width,
      };
    },
    // 将表头加入到所属表格
    addHeader() {
      this.parentTable.headers.push(this.header);
    },
    // 初始化
    updateStore() {
      this.setCol();
      this.setHeader();
      this.addCol();
      this.addHeader();
    },
  },
  mounted() {
    this.updateStore();
  },
  watch: {
    label(val) {
      this.col.label = val;
      this.header.label = val;
    },
    prop(val) {
      this.col.prop = val;
    },
    width(val) {
      this.col.width = val;
    },
  },
  render(h) {
    return h('div', this.$slots.default);
  },
};
