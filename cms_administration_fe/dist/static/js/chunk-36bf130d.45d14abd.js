(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-36bf130d"],{"47a0":function(t,e,i){"use strict";i.r(e);i("b0c0");var a=function(){var t=this,e=t._self._c;return e("el-row",{staticClass:"app-container list-account"},[e("el-row",{staticClass:"list-account__header"},[e("el-col",{staticStyle:{display:"flex"},attrs:{sm:24}},[e("h3",{staticStyle:{margin:"0",width:"100%",padding:"10px"}},[t._v("Danh sách quyền")]),e("div",{staticStyle:{width:"100%"}},[e("el-button",{staticStyle:{float:"right","padding-top":"11px"},attrs:{type:"primary"},on:{click:t.handleCreateAccount}},[t._v("Tạo quyền + ")])],1)])],1),e("div",{staticClass:"filter-container"},[e("el-col",{staticClass:"mr-10",attrs:{sm:4}},[e("el-input",{staticClass:"filter-item full-width",attrs:{placeholder:"Tên quyền",clearable:""},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleFilter.apply(null,arguments)}},model:{value:t.listQuery.title,callback:function(e){t.$set(t.listQuery,"title",e)},expression:"listQuery.title"}})],1),e("el-col",{staticClass:"mr-10",attrs:{sm:4}},[e("el-input",{staticClass:"filter-item full-width",attrs:{placeholder:"Slug",clearable:""},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleFilter.apply(null,arguments)}},model:{value:t.listQuery.name,callback:function(e){t.$set(t.listQuery,"name",e)},expression:"listQuery.name"}})],1),e("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:t.handleFilter}},[t._v(" Tìm kiếm ")])],1),e("el-row",{staticClass:"list-account__data"},[e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingTable,expression:"loadingTable"}],staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""}},[e("el-table-column",{attrs:{label:"STT",width:"100",align:"center",type:"index",index:t.handleIndexMethod}}),e("el-table-column",{attrs:{label:"ID",prop:"id",width:"100",align:"center"}}),e("el-table-column",{attrs:{prop:"title",label:"Tên quyền",align:"center"}}),e("el-table-column",{attrs:{prop:"name",label:"Slug",align:"center"}}),e("el-table-column",{attrs:{label:"Ngày tạo",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.row;return[t._v(" "+t._s(t.convertDateTimeSecond(i.created_at))+" ")]}}])})],1),e("el-row",{staticClass:"list-shop__footer"},[e("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>t.listQuery.limit,expression:"total > listQuery.limit"}],attrs:{total:t.total,limit:t.listQuery.limit,page:t.listQuery.page},on:{"update:limit":function(e){return t.$set(t.listQuery,"limit",e)},"update:page":function(e){return t.$set(t.listQuery,"page",e)},pagination:t.onGetList}})],1),e("dialog-add-role",{attrs:{"show-dialog":t.onShowDialog,"is-add":t.isAdd,"object-data":t.dialogObject},on:{onClickButtonDialog:t.handleClickButtonDialog}})],1)],1)},n=[],o=(i("d3b7"),i("333d")),l=function(){var t=this,e=t._self._c;return e("el-dialog",{attrs:{title:t.dialog.titleName,visible:t.showDialog,"before-close":t.handleClose},on:{"update:visible":function(e){t.showDialog=e}}},[e("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingDialog,expression:"loadingDialog"}],ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{rules:t.rules,model:t.objectData}},[e("el-form-item",{attrs:{label:"Tên quyền",prop:"title"}},[e("el-input",{attrs:{placeholder:"Tên quyền"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.onSubmitForm()}},model:{value:t.formRequest.title,callback:function(e){t.$set(t.formRequest,"title",e)},expression:"formRequest.title"}})],1),e("el-form-item",{attrs:{label:"Slug",prop:"name"}},[e("el-input",{attrs:{placeholder:"Slug"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.onSubmitForm()}},model:{value:t.formRequest.name,callback:function(e){t.$set(t.formRequest,"name",e)},expression:"formRequest.name"}})],1)],1),e("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:t.handleClose}},[t._v("Hủy")]),e("el-button",{attrs:{type:"primary",loading:t.loadingSubmit},on:{click:function(e){return t.onSubmitForm()}}},[t._v(t._s(t.dialog.buttonName))])],1)],1)},r=[],s=i("61f7"),u=i("d267"),c=new u["a"],d={name:"DialogFormNotification",props:{objectData:{type:Object,default:function(){return{}}},showDialog:{type:Boolean,default:!1},isAdd:{type:Boolean,default:!1}},data:function(){var t=this;return{loadingDialog:!1,rules:{name:[{validator:function(e,i,a){return Object(s["q"])(e,t.formRequest.name,a,"Slug",2,40)},trigger:"change"}],title:[{validator:function(e,i,a){return Object(s["q"])(e,t.formRequest.title,a,"Tên quyền",2,100)},trigger:"change"}]},dialog:{titleName:"Thêm mới quyền",buttonName:"Thêm"},loadingSubmit:!1,formRequest:{}}},watch:{isAdd:function(t){this.dialog=t?{titleName:"Thêm mới quyền",buttonName:"Thêm"}:{titleName:"Cập nhật quyền",buttonName:"Cập nhập"}},objectData:function(t){t.row&&(this.formRequest=t.row)}},methods:{onSubmitForm:function(){var t=this;this.$refs.ruleForm.validate((function(e){e&&(t.isAdd?t.handleAdd():t.handleUpdate())}))},handleAdd:function(){var t=this;this.loadingSubmit=!0,c.create(this.formRequest).then((function(e){0===e.error_code?(t.$emit("onClickButtonDialog",{dialog:!1,reload:!0}),t.resetFormRequest(),t.$message.success(e.error_msg)):t.$message.error(e.error_msg)})).finally((function(){t.loadingSubmit=!1}))},handleUpdate:function(){var t=this;this.loadingSubmit=!0,c.update(this.formRequest).then((function(e){0===e.error_code?(t.$emit("onClickButtonDialog",{dialog:!1,reload:!0}),t.resetFormRequest(),t.$message.success(e.error_msg)):t.$message.error(e.error_msg)})).finally((function(){t.loadingSubmit=!1}))},resetFormRequest:function(){var t=this;this.formRequest={},setTimeout((function(){t.$refs["ruleForm"].clearValidate()}),0)},handleClose:function(){this.$emit("onClickButtonDialog",{dialog:!1,reload:!1}),this.resetFormRequest()}}},m=d,h=(i("edfe"),i("2877")),f=Object(h["a"])(m,l,r,!1,null,"078c6f20",null),p=f.exports,g=i("d4ec"),y=i("bee2"),b=i("262e"),v=i("2caf"),_=(i("99af"),i("6c6e")),k=i("b775"),w="https://prod-wap-wghn-beta.vcallid.com",D=function(t){Object(b["a"])(i,t);var e=Object(v["a"])(i);function i(){return Object(g["a"])(this,i),e.call(this,"type-service")}return Object(y["a"])(i,[{key:"TypeServiceList",value:function(){return Object(k["a"])({url:w+"/".concat(this.uri,"/all"),method:"get"})}},{key:"list",value:function(t,e){return Object(k["a"])({url:w+"/".concat(this.uri,"/search"),method:"post",data:t,params:e})}},{key:"create",value:function(t){return Object(k["a"])({url:w+"/".concat(this.uri,"/create"),method:"post",data:t})}},{key:"remove",value:function(t){return Object(k["a"])({url:w+"/".concat(this.uri,"/remove/").concat(t),method:"get"})}},{key:"update",value:function(t,e){return Object(k["a"])({url:w+"/".concat(this.uri,"/update/").concat(t),method:"post",data:e})}}]),i}(_["a"]),S=i("c1df"),q=i.n(S),C=i("bcc2"),O=i("60fe"),T=new u["a"],x=new D,j={name:"List",components:{DialogAddRole:p,Pagination:o["a"]},data:function(){return{tableData:[],loadingTable:!1,listQuery:{page:1,limit:10},listBody:{},total:0,isAdd:!0,onShowDialog:!1,dialogObject:{},time_step_1:"",time_step_2:"",type_services:[],clubRoleList:O["b"]}},computed:{datePickerOptions:function(){var t=this;return{disabledDate:function(e){var i=new Date(t.time_step_1);return i.setDate(i.getDate()+1),e.getTime()<i.getTime()}}}},watch:{time_step_1:function(t){this.listBody.time_step_1=t?q()(t).unix():""},time_step_2:function(t){this.listBody.time_step_2=t?q()(t).unix():""}},created:function(){this.onGetList()},methods:{onGetListTypeService:function(){var t=this;x.TypeServiceList().then((function(e){0===e.error_code&&(t.type_services=e.data)}))},onShowDialogEdit:function(t){this.dialogObject={row:t,type_services:this.type_services},this.isAdd=!1,this.onShowDialog=!0},handleCreateAccount:function(){this.dialogObject={row:null,type_services:this.type_services},this.isAdd=!0,this.onShowDialog=!0},handleClickButtonDialog:function(t){this.onShowDialog=t.dialog,t.reload&&this.onGetList()},onDeleteAccount:function(t){var e=this;this.$confirm("Bạn có chắc chắn muốn xóa vai trò ".concat(t.name)).then((function(i){T.remove(t.id).then((function(t){0===t.error_code?(e.onGetList(),e.$message.success(t.error_msg)):e.$message.error(t.error_msg)}))}))},onGetList:function(){var t=this;this.loadingTable=!0,T.list(this.listQuery).then((function(e){var i,a;t.tableData=(null===e||void 0===e||null===(i=e.data)||void 0===i?void 0:i.data)||[],t.total=(null===e||void 0===e||null===(a=e.data)||void 0===a?void 0:a.total)||0})).finally((function(){t.loadingTable=!1}))},handleFilter:function(){this.listQuery.page=1,this.onGetList()},handleIndexMethod:function(t){return 1===this.listQuery.page?this.listQuery.page+t:(this.listQuery.page-1)*this.listQuery.limit+t+1},convertDateTimeSecond:C["c"]}},Q=j,R=(i("805b"),Object(h["a"])(Q,a,n,!1,null,"f5bdc70c",null));e["default"]=R.exports},"805b":function(t,e,i){"use strict";i("f6c5")},9706:function(t,e,i){},edfe:function(t,e,i){"use strict";i("9706")},f6c5:function(t,e,i){}}]);