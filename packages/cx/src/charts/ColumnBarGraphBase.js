import {Widget, VDOM} from '../ui/Widget';
import {Selection} from '../ui/selection/Selection';

export class ColumnBarGraphBase extends Widget {

   init() {
      this.selection = Selection.create(this.selection, {
         records: this.data
      });
      super.init();
   }

   declareData() {

      var selection = this.selection.configureWidget(this);

      super.declareData(selection, ...arguments, {
         data: undefined,
         class: {
            structured: true
         },
         className: {
            structured: true
         },
         style: {
            structured: true
         },
         colorIndex: undefined,
         colorMap: undefined,
         name: undefined,
         size: undefined,
         offset: undefined,
         y0: undefined,
         x0: undefined,
         autoSize: undefined,
         active: true,
         stacked: undefined,
         stack: undefined
      })
   }

   explore(context, instance) {
      var xAxis = instance.xAxis = context.axes[this.xAxis];
      var yAxis = instance.yAxis = context.axes[this.yAxis];

      var {data} = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.name)
         instance.colorMap.acknowledge(data.name);

      super.explore(context, instance);
   }

   prepare(context, instance) {
      super.prepare(context, instance);

      let {data, colorMap, xAxis, yAxis} = instance;

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.name);
         if (instance.colorIndex != data.colorIndex) {
            instance.colorIndex = data.colorIndex;
            instance.shouldUpdate = true;
         }
      }

      if (xAxis.shouldUpdate || yAxis.shouldUpdate)
         instance.shouldUpdate = true;

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            selected: this.selection.isInstanceSelected(instance),
            style: data.style,
            shape: this.legendShape,
            onClick: e=> { this.onLegendClick(e, instance) }
         });
   }

   onLegendClick(e, instance) {
      var allActions = this.legendAction == 'auto';
      var {data} = instance;
      if (allActions || this.legendAction == 'toggle')
         instance.set('active', !data.active);
   }

   render(context, instance, key) {
      var {data} = instance;
      return <g key={key} className={data.classNames}>
         {data.active && this.renderGraph(context, instance)}
      </g>;
   }

   handleClick(e, instance, point, index) {
      if (this.onClick && this.onClick(e, instance, point, index) === false)
         return;

      if (!this.selection.isDummy)
         this.selection.select(instance.store, point, index, e.ctrlKey);
   }
}

ColumnBarGraphBase.prototype.xAxis = 'x';
ColumnBarGraphBase.prototype.yAxis = 'y';
ColumnBarGraphBase.prototype.xField = 'x';
ColumnBarGraphBase.prototype.yField = 'y';
ColumnBarGraphBase.prototype.colorIndexField = false;
ColumnBarGraphBase.prototype.size = 1;
ColumnBarGraphBase.prototype.legend = 'legend';
ColumnBarGraphBase.prototype.legendAction = 'auto';
ColumnBarGraphBase.prototype.legendShape = 'rect';
ColumnBarGraphBase.prototype.stack = 'stack';
ColumnBarGraphBase.prototype.stacked = false;
ColumnBarGraphBase.prototype.autoSize = 0;
ColumnBarGraphBase.prototype.offset = 0;
ColumnBarGraphBase.prototype.pure = false;