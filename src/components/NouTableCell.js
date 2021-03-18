export default {
  name: 'NouTableCell',
  props: {
    tr: {
      type: Object,
      require: true,
    },
    td: {
      type: Object,
      require: true,
    },
    rowIndex: {
      type: Number,
      require: true,
    },
    colIndex: {
      type: Number,
      require: true,
    },
  },
  render() {
    return (
      <div class="nou-table__cell">
        {
          this.td.render
            ? this.td.render({
              row: this.tr,
              $index: this.rowIndex,
            })
            : this.td.formatter(this.tr[this.td.prop])
        }
      </div>
    );
  },
};
