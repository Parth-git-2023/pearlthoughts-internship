import invariant from 'invariant';

class Widgets {
    constructor(){
        this.register = (widget)=>{
            if (Array.isArray(widget)) {
                widget.forEach((newWidget)=>{
                    this.register(newWidget);
                });
            } else {
                invariant(widget.id, 'An id must be provided');
                invariant(widget.component, 'A component must be provided');
                invariant(widget.title, 'A title must be provided');
                invariant(widget.icon, 'An icon must be provided');
                // Replace id and pluginId with computed uid
                const { id, pluginId, ...widgetToStore } = widget;
                const uid = pluginId ? `plugin::${pluginId}.${id}` : `global::${id}`;
                this.widgets[uid] = {
                    ...widgetToStore,
                    uid
                };
            }
        };
        this.getAll = ()=>{
            return Object.values(this.widgets);
        };
        this.widgets = {};
    }
}

export { Widgets };
//# sourceMappingURL=Widgets.mjs.map
