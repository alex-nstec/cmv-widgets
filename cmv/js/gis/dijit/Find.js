/*  ConfigurableMapViewerCMV
 *  version 1.3.3
 *  Project: http://cmv.io/
 */

define(["dojo/_base/declare","dijit/_WidgetBase","dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin","dojo/dom-construct","dojo/_base/lang","dojo/_base/array","dojo/on","dojo/keys","dojo/store/Memory","dgrid/OnDemandGrid","dgrid/Selection","dgrid/Keyboard","esri/layers/GraphicsLayer","esri/graphic","esri/renderers/SimpleRenderer","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleLineSymbol","esri/symbols/SimpleFillSymbol","esri/graphicsUtils","esri/tasks/FindTask","esri/tasks/FindParameters","esri/geometry/Extent","dojo/text!./Find/templates/Find.html","dojo/i18n!./Find/nls/resource","dijit/form/Form","dijit/form/FilteringSelect","dijit/form/ValidationTextBox","dijit/form/CheckBox","xstyle/css!./Find/css/Find.css"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y){return a([b,c,d],{widgetsInTemplate:!0,templateString:x,baseClass:"gis_FindDijit",i18n:y,spatialReference:null,pointExtentSize:null,defaultSymbols:{point:{type:"esriSMS",style:"esriSMSCircle",size:25,color:[0,255,255,32],angle:0,xoffset:0,yoffset:0,outline:{type:"esriSLS",style:"esriSLSSolid",color:[0,255,255,255],width:2}},polyline:{type:"esriSLS",style:"esriSLSSolid",color:[0,255,255,255],width:3},polygon:{type:"esriSFS",style:"esriSFSSolid",color:[0,255,255,32],outline:{type:"esriSLS",style:"esriSLSSolid",color:[0,255,255,255],width:3}}},postCreate:function(){this.inherited(arguments),null===this.spatialReference&&(this.spatialReference=this.map.spatialReference.wkid),null===this.pointExtentSize&&(this.pointExtentSize=4326===this.spatialReference?1e-4:500),this.createGraphicLayers(),this.own(h(this.searchTextDijit,"keyup",f.hitch(this,function(a){a.keyCode===i.ENTER&&this.search()}))),this.queryIdx=0;var a=0,b=this.queries.length;for(a=0;b>a;a++)this.queries[a].id=a;if(b>1){var c=new j({data:this.queries});this.querySelectDijit.set("store",c),this.querySelectDijit.set("value",this.queryIdx)}else this.querySelectDom.style.display="none"},createGraphicLayers:function(){var a=null,b=null,c=null,d=null,e=null,g=null,h=f.mixin({},this.symbols);h={point:f.mixin(this.defaultSymbols.point,h.point),polyline:f.mixin(this.defaultSymbols.polyline,h.polyline),polygon:f.mixin(this.defaultSymbols.polygon,h.polygon)},this.pointGraphics=new n({id:"findGraphics_point",title:"Find"}),h.point&&(a=new q(h.point),d=new p(a),d.label="Find Results (Points)",d.description="Find results (Points)",this.pointGraphics.setRenderer(d)),this.polylineGraphics=new n({id:"findGraphics_line",title:"Find Graphics"}),h.polyline&&(b=new r(h.polyline),e=new p(b),e.label="Find Results (Lines)",e.description="Find Results (Lines)",this.polylineGraphics.setRenderer(e)),this.polygonGraphics=new n({id:"findGraphics_polygon",title:"Find Graphics"}),h.polygon&&(c=new s(h.polygon),g=new p(c),g.label="Find Results (Polygons)",g.description="Find Results (Polygons)",this.polygonGraphics.setRenderer(g)),this.map.addLayer(this.polygonGraphics),this.map.addLayer(this.polylineGraphics),this.map.addLayer(this.pointGraphics)},search:function(){var a=this.queries[this.queryIdx],b=this.searchTextDijit.get("value");if(a&&b&&0!==b.length){if(a.minChars&&b.length<a.minChars)return this.findResultsNode.innerHTML="You must enter at least "+a.minChars+" characters.",void(this.findResultsNode.style.display="block");if(this.createResultsGrid(),this.clearResultsGrid(),this.clearFeatures(),e.empty(this.findResultsNode),a&&a.url&&a.layerIds&&a.searchFields){var c=new v;c.returnGeometry=!0,c.layerIds=a.layerIds,c.searchFields=a.searchFields,c.layerDefinitions=a.layerDefs,c.searchText=b,c.contains=!this.containsSearchText.checked,c.outSpatialReference={wkid:this.spatialReference},this.findResultsNode.innerHTML=this.i18n.searching,this.findResultsNode.style.display="block";var d=new u(a.url);d.execute(c,f.hitch(this,"showResults"))}}},createResultsGrid:function(){if(this.resultsStore||(this.resultsStore=new j({idProperty:"id",data:[]})),!this.resultsGrid){var b=a([k,m,l]);this.resultsGrid=new b({selectionMode:"single",cellNavigation:!1,showHeader:!0,store:this.resultsStore,columns:{layerName:"Layer",foundFieldName:"Field",value:"Result"},sort:[{attribute:"value",descending:!1}]},this.findResultsGrid),this.resultsGrid.startup(),this.resultsGrid.on(".dgrid-row:click",f.hitch(this,"zoomOnRowClick")),this.resultsGrid.on(".dgrid-row:keyup",f.hitch(this,"zoomOnKeyboardNavigation"))}},showResults:function(a){var b="";if(this.resultIdx=0,this.results=a,this.results.length>0){var c=1===this.results.length?"":this.i18n.resultsLabel.multipleResultsSuffix;b=this.results.length+" "+this.i18n.resultsLabel.labelPrefix+c+" "+this.i18n.resultsLabel.labelSuffix,this.highlightFeatures(),this.showResultsGrid()}else b="No Results Found";this.findResultsNode.innerHTML=b},showResultsGrid:function(){var a=this.queries[this.queryIdx];this.resultsGrid.store.setData(this.results),this.resultsGrid.refresh();var b="block";1===a.layerIds.length&&(b="none"),this.resultsGrid.styleColumn("layerName","display:"+b),a&&a.hideGrid!==!0&&(this.findResultsGrid.style.display="block")},highlightFeatures:function(){var a=0;g.forEach(this.results,function(b){b.id=a,a++;var c,d=b.feature;switch(d.geometry.type){case"point":d.geometry.x&&d.geometry.y&&(c=new o(d.geometry),this.pointGraphics.add(c));break;case"polyline":d.geometry.paths&&d.geometry.paths.length>0&&(c=new o(d.geometry),this.polylineGraphics.add(c));break;case"polygon":d.geometry.rings&&d.geometry.rings.length>0&&(c=new o(d.geometry,null,{ren:1}),this.polygonGraphics.add(c))}},this);var b=null;this.pointGraphics.graphics.length>0&&(b=this.getPointFeaturesExtent(this.pointGraphics.graphics)),this.polylineGraphics.graphics.length>0&&(b=null===b?t.graphicsExtent(this.polylineGraphics.graphics):b.union(t.graphicsExtent(this.polylineGraphics.graphics))),this.polygonGraphics.graphics.length>0&&(b=null===b?t.graphicsExtent(this.polygonGraphics.graphics):b.union(t.graphicsExtent(this.polygonGraphics.graphics))),b&&this.zoomToExtent(b)},zoomOnRowClick:function(a){var b=this.getFeatureFromRowEvent(a);this.getFeatureExtentAndZoom(b)},zoomOnKeyboardNavigation:function(a){var b=a.keyCode;if(38===b||40===b){var c=this.getFeatureFromRowEvent(a);this.getFeatureExtentAndZoom(c)}},getFeatureFromRowEvent:function(a){var b=this.resultsGrid.row(a);if(!b)return null;var c=b.data;return c?c.feature:null},getFeatureExtentAndZoom:function(a){if(a){var b=a.geometry.getExtent();b||"point"!==a.geometry.type||(b=this.getExtentFromPoint(a)),b&&this.zoomToExtent(b)}},zoomToExtent:function(a){this.map.setExtent(a.expand(1.2))},clearResults:function(){this.results=null,this.clearResultsGrid(),this.clearFeatures(),this.searchFormDijit.reset(),this.querySelectDijit.setValue(this.queryIdx),e.empty(this.findResultsNode)},clearResultsGrid:function(){this.resultStore&&this.resultsStore.setData([]),this.resultsGrid&&this.resultsGrid.refresh(),this.findResultsNode.style.display="none",this.findResultsGrid.style.display="none"},clearFeatures:function(){this.pointGraphics.clear(),this.polylineGraphics.clear(),this.polygonGraphics.clear()},getPointFeaturesExtent:function(a){var b=t.graphicsExtent(a);return null===b&&a.length>0&&(b=this.getExtentFromPoint(a[0])),b},getExtentFromPoint:function(a){var b=this.pointExtentSize,c=a.geometry,d=new w({xmin:c.x-b,ymin:c.y-b,xmax:c.x+b,ymax:c.y+b,spatialReference:{wkid:this.spatialReference}});return d},_onQueryChange:function(a){a>=0&&a<this.queries.length&&(this.queryIdx=a)}})});
//# sourceMappingURL=Find.map