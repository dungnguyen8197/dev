(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0ecbd546"],{"0c2c":function(e,t,n){},5414:function(e,t,n){"use strict";e.exports={pickerOptions:[{text:"7 ngày trước",onClick:function(e){var t=new Date,n=new Date;n.setTime(n.getTime()-6048e5),e.$emit("pick",[n,t])}},{text:"30 ngày trước",onClick:function(e){var t=new Date,n=new Date;n.setTime(n.getTime()-2592e6),e.$emit("pick",[n,t])}},{text:"90 ngày trước",onClick:function(e){var t=new Date,n=new Date;n.setTime(n.getTime()-7776e6),e.$emit("pick",[n,t])}}],selectOptions:[{value:-1,label:"Tất cả"},{value:0,label:"Chưa thanh toán"},{value:1,label:"Đã thanh toán"},{value:2,label:"Thanh toán lỗi"}]}},5664:function(e,t,n){"use strict";n("0c2c")},5723:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var a=n("d4ec"),i=n("bee2"),o=n("262e"),l=n("2caf"),c=(n("99af"),n("6c6e")),r=n("b775"),s=function(e){Object(o["a"])(n,e);var t=Object(l["a"])(n);function n(){return Object(a["a"])(this,n),t.call(this,"admin")}return Object(i["a"])(n,[{key:"Lists",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/list-admin"),method:"post",data:e})}},{key:"AccountList",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/search?").concat(e),method:"get",data:e})}},{key:"storeAccount",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/create"),method:"post",data:e})}},{key:"updateAccount",value:function(e,t){return Object(r["a"])({url:"/".concat(this.uri,"/update-admin-role/").concat(t),method:"post",data:e})}},{key:"ChangePassword",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/change_pass"),method:"post",data:e})}},{key:"changeProfile",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/update_profile"),method:"post",data:e})}},{key:"profileList",value:function(){return Object(r["a"])({url:"/".concat(this.uri,"/get_profile"),method:"get"})}},{key:"forgotPassword",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/forgot_password"),method:"post",data:e})}},{key:"SendEmail",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/get_captcha_verify"),method:"post",data:e})}},{key:"deleteAccount",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/remove/").concat(e),method:"get"})}},{key:"accountTelesale",value:function(){return Object(r["a"])({url:"/".concat(this.uri,"/list_telesale"),method:"get"})}},{key:"searchAdmin",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/search"),method:"get",params:e})}},{key:"getByLevel",value:function(e,t){return Object(r["a"])({url:"/".concat(this.uri,"/get-by-level"),method:"post",data:{role_id:e},params:{admin_id:t}})}},{key:"getChildren",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/get-children/").concat(e),method:"get"})}},{key:"storeAccountClub",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/create-admin-club"),method:"post",data:e})}},{key:"updateAccountClub",value:function(e,t){return Object(r["a"])({url:"/".concat(this.uri,"/update-admin-club/").concat(t),method:"post",data:e})}},{key:"deleteAccountClub",value:function(e,t){return Object(r["a"])({url:"/".concat(this.uri,"/remove-admin-club/").concat(t),method:"post",data:e})}},{key:"updateAdminBoss",value:function(e,t){return Object(r["a"])({url:"/".concat(this.uri,"/update-admin-boss/").concat(t),method:"post",data:e})}},{key:"listAccountHIO",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-account-hio"),method:"get",params:e})}},{key:"storeAccountHIO",value:function(e){return Object(r["a"])({url:"/".concat(this.uri,"/create-account-hio"),method:"post",data:e})}},{key:"updateAccountHIO",value:function(e,t){return Object(r["a"])({url:"/".concat(this.uri,"/update-account-hio/").concat(t),method:"post",data:e})}}]),n}(c["a"])},"7e62":function(e,t,n){"use strict";var a=function(){var e=this,t=e._self._c;return t("section",[t("el-select",{ref:"searchFacility",staticClass:"w-100",attrs:{clearable:"",filterable:"",size:e.size,remote:"","reserve-keyword":"",placeholder:"Tìm kiếm sân golf","remote-method":e.onSearchFacility,loading:e.loadingSearchFacility},on:{change:e.handleSelectionChange,"hook:mounted":function(t){return e.cancelReadOnly(t,"searchFacility")},"visible-change":function(t){return e.cancelReadOnly(t,"searchFacility")}},model:{value:e.facilityModel,callback:function(t){e.facilityModel=t},expression:"facilityModel"}},e._l(e.facilities,(function(e){return t("el-option",{key:e.value,attrs:{label:e.label,value:e}})})),1)],1)},i=[],o=(n("d81d"),n("9a76")),l=n("61f7"),c=new o["a"],r={name:"SearchFacility",props:{clearData:{type:Boolean,default:!1},size:{type:String,default:"medium"},dataModel:{type:Object,default:function(){return{}}}},data:function(){return{facilityModel:null,facilities:[],loadingSearchFacility:!1}},watch:{clearData:function(e){console.log("val.........",e),e&&(this.facilityModel={},this.facilities=[]),console.log(this.facilityModel,this.facilities)},dataModel:function(e){console.log("val.............editttttttttttttttttttttt........dataModel",Object(l["b"])(e),e),Object(l["b"])(e)?(console.log("vào đây..............................",Object(l["b"])(e)),this.facilityModel={},this.facilities=[],console.log("this.facilityModel",this.facilityModel),console.log("this.facilities",this.facilities)):(console.log("tại sao lại vào đây..............................",!Object(l["b"])(e)),this.facilityModel={value:e.id,label:e.label},this.facilities=[this.facilityModel],console.log("this.facilityModel cos data ..........................",this.facilityModel))}},methods:{onSearchFacility:function(e){var t=this;console.log("keyword......................",e),c.listFacility({title:e}).then((function(e){var n=e.data;0===e.error_code?n.length>0?t.facilities=n.map((function(e){return{value:e.id,label:e.sub_title,booking:e.booking,path:e.paths}})):t.facilities=[]:t.$message.error(e.error_msg)}))},handleSelectionChange:function(e){this.$emit("selection-changed-facility",this.facilityModel)},cancelReadOnly:function(e,t){var n=this;this.$nextTick((function(){if(!e){var a=n.$refs[t],i=a.$el.querySelector(".el-input__inner");i.removeAttribute("readonly")}}))}}},s=r,u=n("2877"),d=Object(u["a"])(s,a,i,!1,null,null,null);t["a"]=d.exports},"8c04":function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var a=n("d4ec"),i=n("bee2"),o=n("262e"),l=n("2caf"),c=(n("99af"),n("6c6e")),r=n("b775"),s=function(e){Object(o["a"])(n,e);var t=Object(l["a"])(n);function n(){return Object(a["a"])(this,n),t.call(this,"insurance-hio")}return Object(i["a"])(n,[{key:"listInsurance",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-insurance"),method:"get",params:e})}},{key:"changeStatusCustomerPayAll",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/change-status-customer-pay-all-cms"),method:"post",data:e})}},{key:"sendRequestInsurancePvi",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/send-request-pvi-cms"),method:"post",data:e})}},{key:"listQR",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-qr"),method:"get",params:e})}},{key:"listHolePar3",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-hole-par-3"),method:"get",params:e})}},{key:"createQR",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/create-qr"),method:"post",data:e})}},{key:"updateStatusQr",value:function(e,t){return Object(r["a"])({url:"".concat(this.uri,"/update-status-qr/").concat(t),method:"post",data:e})}},{key:"listInsuranceS",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-insurance-s"),method:"get",params:e})}},{key:"listContract",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-contract"),method:"get",params:e})}},{key:"storeContract",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/store-contract"),method:"post",data:e})}},{key:"updateContract",value:function(e,t){return Object(r["a"])({url:"".concat(this.uri,"/update-contract/").concat(t),method:"post",data:e})}},{key:"searchContract",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/search-contract"),method:"post",data:e})}},{key:"searchContractCode",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/search-contract-code"),method:"post",data:e})}},{key:"updateStatusContract",value:function(e,t){return Object(r["a"])({url:"".concat(this.uri,"/update-status-contract/").concat(t),method:"post",data:e})}},{key:"revenueContract",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/revenue-contract"),method:"get",params:e})}},{key:"exportRevenueContract",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/export-revenue-contract"),method:"get",params:e})}},{key:"exportListInsuranceS",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/export-list-insurance-s"),method:"get",params:e})}},{key:"listMemberInsurance",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-member-s"),method:"get",params:e})}},{key:"listInsuranceDialog",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/list-insurance-dialog"),method:"get",params:e})}},{key:"exportListInsuranceDialog",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/export-list-insurance-dialog"),method:"get",params:e})}},{key:"cms_list_masterial_coverd",value:function(e){return Object(r["a"])({url:"".concat(this.uri,"/cms_list_masterial_coverd"),method:"get",params:e})}}]),n}(c["a"])},"8ffd":function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var a="https://prod-wap-wghn-beta.vcallid.com/"},"9a76":function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var a=n("d4ec"),i=n("bee2"),o=n("262e"),l=n("2caf"),c=n("6c6e"),r=n("b775"),s="https://prod-wap-wghn-beta.vcallid.com",u=function(e){Object(o["a"])(n,e);var t=Object(l["a"])(n);function n(){return Object(a["a"])(this,n),t.call(this,"facility")}return Object(i["a"])(n,[{key:"listFacility",value:function(e){return Object(r["a"])({url:s+"/".concat(this.uri,"/list"),method:"post",data:e})}},{key:"searchFacilityNew",value:function(e){return Object(r["a"])({url:s+"/".concat(this.uri,"/search"),method:"post",data:e})}},{key:"Detail",value:function(e){return Object(r["a"])({url:s+"/".concat(this.uri,"/detail"),method:"post",data:e})}}]),n}(c["a"])},a0f7:function(e,t,n){"use strict";n.r(t);n("b0c0"),n("ac1f"),n("5319"),n("7db0"),n("d3b7"),n("b64b");var a=function(){var e=this,t=e._self._c;return t("div",{staticClass:"p-10"},[t("el-row",{staticClass:"mb-10"},[t("el-col",{attrs:{span:12}},[t("h4",[e._v("Danh sách đơn hàng")])])],1),t("el-row",{staticClass:"p-10"},[t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("el-input",{attrs:{size:"small",placeholder:"Mã đơn hàng",clearable:""},on:{change:e.changeSearch},model:{value:e.listQuery.id_material_covered,callback:function(t){e.$set(e.listQuery,"id_material_covered",t)},expression:"listQuery.id_material_covered"}})],1),t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("search-admin",{attrs:{size:"small"},on:{"selection-changed-admin":e.handleSelectionChangedAdmin}})],1),t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("search-user",{attrs:{size:"small"},on:{"selection-changed-user":e.handleSelectionChangedUser}})],1),t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("search-facility",{attrs:{size:"small"},on:{"selection-changed-facility":e.handleSelectionChangedFacility}})],1),t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("search-agency-h-i-o",{attrs:{size:"small"},on:{"selection-changed-agency-hio":e.handleSelectionChangedAgency}})],1),t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("el-select",{staticClass:"filter-item mr-10 w-100",attrs:{size:"small",clearable:"",placeholder:"Trạng thái"},on:{change:e.changeSearch},model:{value:e.listQuery.status,callback:function(t){e.$set(e.listQuery,"status",t)},expression:"listQuery.status"}},e._l(e.status,(function(e,n){return t("el-option",{key:n,attrs:{label:e,value:n}})})),1)],1),t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("el-select",{staticClass:"filter-item mr-10 w-100",attrs:{size:"small",clearable:"",placeholder:"Trạng thái thanh toán"},on:{change:e.changeSearch},model:{value:e.listQuery.is_pay,callback:function(t){e.$set(e.listQuery,"is_pay",t)},expression:"listQuery.is_pay"}},[t("el-option",{attrs:{value:"1",label:"Đã thanh toán"}}),t("el-option",{attrs:{value:"0",label:"Chưa thanh toán"}})],1)],1),t("el-col",{staticClass:"mr-1 mb-1",attrs:{span:4}},[t("el-select",{staticClass:"filter-item mr-10 w-100",attrs:{size:"small",clearable:"",placeholder:"Trạng thái gửi PVI"},on:{change:e.changeSearch},model:{value:e.listQuery.is_send_pvi,callback:function(t){e.$set(e.listQuery,"is_send_pvi",t)},expression:"listQuery.is_send_pvi"}},e._l(e.statusSendPVI,(function(e,n){return t("el-option",{key:n,attrs:{value:n,label:e}})})),1)],1),t("el-col",{attrs:{sm:6}},[t("el-date-picker",{staticClass:"date-rang-history",attrs:{size:"small",type:"daterange",align:"right","unlink-panels":"","range-separator":"đến","start-placeholder":"Ngày bắt đầu","end-placeholder":"Ngày kết thúc"},model:{value:e.dateRange,callback:function(t){e.dateRange=t},expression:"dateRange"}})],1)],1),t("el-row",{staticStyle:{"padding-bottom":"10px"}},[t("el-button",{attrs:{round:"",icon:"el-icon-refresh"},on:{click:e.onResetQuery}},[e._v("Tải lại")]),t("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.onGetList}},[e._v(" Tìm kiếm ")]),t("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.onExportExcel}},[e._v(" Export Excel ")]),t("el-button",{attrs:{type:"success"},on:{click:function(t){e.dialogBillFormVisible=!0}}},[e._v("Tạo đơn +")])],1),t("el-row",[t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loadingTable,expression:"loadingTable"}],staticStyle:{width:"100%"},attrs:{data:e.dataTable,border:""}},[t("el-table-column",{attrs:{type:"index",label:"STT",index:e.handleIndexMethod,width:"50",align:"center"}}),t("el-table-column",{attrs:{prop:"id",label:"Mã BH",align:"center"}}),t("el-table-column",{attrs:{label:"Đại lý",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("span",{staticStyle:{"margin-left":"10px"}},[e._v(e._s(a.agent?a.agent.name:""))])]}}])}),t("el-table-column",{attrs:{prop:"name_tour",label:"Tên giải đấu",align:"center"}}),t("el-table-column",{attrs:{prop:"course_name",label:"Tên sân",align:"center"}}),t("el-table-column",{attrs:{prop:"hole_select",label:"Hố",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("span",{staticStyle:{"margin-left":"10px"}},[e._v(e._s(a.hole_select.replace(/,$/,"")))])]}}])}),t("el-table-column",{attrs:{prop:"user_id",label:"Mã ID",align:"center"}}),t("el-table-column",{attrs:{label:"Tên sản phẩm",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("div",{staticStyle:{display:"block"}},[t("span",[e._v(e._s(a.product?a.product.name:""))])]),t("div",[t("span",[e._v(e._s(a.product?e.formatNumber(a.product.price):""))])])]}}])}),t("el-table-column",{attrs:{label:"Số người chơi",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[e._v(" "+e._s(n.ListUserMaterialCovered?n.ListUserMaterialCovered.length:"")+" ")]}}])}),t("el-table-column",{attrs:{prop:"total_pay",label:"Giá",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("span",{staticStyle:{"margin-left":"10px"}},[e._v(e._s(e.formatNumber(a.total_pay)))])]}}])}),t("el-table-column",{attrs:{label:"Ngày chơi",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("span",{staticStyle:{"margin-left":"10px"}},[e._v(e._s(e.convertDateTime(a.date_played)))])]}}])}),t("el-table-column",{attrs:{label:"Ngày tạo",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("span",{staticStyle:{"margin-left":"10px"}},[e._v(e._s(e.convertDateTime(a.created_at)))])]}}])}),t("el-table-column",{attrs:{label:"Trạng thái đơn hàng",align:"center",width:"160px"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("p",[e._v(e._s(e.renderStatus(a)))]),-1===a.is_send_pvi?t("el-tag",{attrs:{type:"danger"}},[e._v(" Gửi PVI lỗi ")]):t("el-tag",[e._v(" "+e._s(e.statusSendPVI[a.is_send_pvi])+" ")])]}}])}),t("el-table-column",{attrs:{prop:"name",label:"Trạng thái gạch nợ",align:"center",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[1===a.is_pay?[t("el-tag",{attrs:{type:"success"}},[e._v("Đã gạch nợ")])]:[t("el-tag",{attrs:{type:"danger"}},[e._v("Chưa gạch nợ")]),0!==a.is_pay||0!==a.is_send_email||a.status!==e.statusCMSConfirm||e.isEmpty(e.roles.find((function(e){return"role_statistic"===e.name})))?e._e():t("div",{staticClass:"m-1"},[t("el-button",{attrs:{type:"primary",size:"mini"},on:{click:function(t){return e.confirmPayment(a)}}},[e._v(" Gạch nợ bằng tay ")])],1)]]}}])}),t("el-table-column",{attrs:{prop:"sale_name",label:" Người xử lý",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("el-tag",{staticStyle:{"margin-left":"10px"},attrs:{type:"primary"}},[e._v(e._s(a.sale_name))])]}}])}),t("el-table-column",{attrs:{prop:"note",label:"Ghi chú",align:"center"}}),t("el-table-column",{attrs:{prop:"name",label:"Hành động",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("el-button",{staticClass:"mg-5",attrs:{disabled:a.is_send_email>0,type:"primary",size:"mini"},on:{click:function(t){return e.onEdit(a)}}},[t("i",{staticClass:"el-icon-edit"})]),t("el-button",{staticClass:"mg-5",attrs:{circle:"",icon:"el-icon-view",title:"Xem thông tin ảnh giám sát"},on:{click:function(t){return e.onShowDialogImage(a)}}}),a.status===e.statusInit?t("el-button",{staticClass:"mg-5",attrs:{type:"primary",size:"mini",title:"Xác nhận bán"},on:{click:function(t){return e.confirmSale(a)}}},[e._v(" Xác nhận bán ")]):e._e(),a.is_confirm_supervisor&&1===a.is_pay&&0===a.is_send_email&&a.status===e.statusCMSConfirm&&!e.isEmpty(e.roles.find((function(e){return"role_statistic"===e.name})))?t("el-button",{directives:[{name:"loading",rawName:"v-loading",value:e.loadingSendMail,expression:"loadingSendMail"}],staticClass:"mg-5",attrs:{type:"primary",size:"mini",title:"Gửi Mail PVI"},on:{click:function(t){return e.sendMailPVI(a)}}},[e._v(" Gửi mail PVI ")]):e._e(),1===a.is_pay?t("el-col",[t("el-link",{attrs:{href:"/#/certificate-item/".concat(a.id),target:"_blank"}},[t("el-button",{attrs:{title:"Xem giấy chứng nhận"}},[e._v("GCN")])],1)],1):e._e(),[1===a.is_send_email&&0===a.is_send_pvi&&1===a.is_pay?t("el-button",{directives:[{name:"loading",rawName:"v-loading",value:e.loadingSendMail,expression:"loadingSendMail"}],staticClass:"mg-5",attrs:{circle:"",icon:"el-icon-upload2",title:"Xác nhận gửi đơn sang PVI"},on:{click:function(t){return e.sendConfirmPVI(a)}}}):e._e()],e.isEmpty(a.PaymentInfo)?e._e():t("el-button",{attrs:{size:"mini",title:"Xem thông tin thanh toán"},on:{click:function(t){return e.onShowPayment(a)}}},[t("i",{staticClass:"el-icon-money"})]),e.isEmpty(a.array_img_request)?e._e():t("el-button",{attrs:{size:"mini",title:"Xem thông tin ảnh yêu cầu"},on:{click:function(t){return e.onShowImageRequest(a)}}},[t("i",{staticClass:"el-icon-picture"})])]}}])})],1)],1),t("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>=e.listQuery.number,expression:"total >= listQuery.number"}],attrs:{total:e.total,limit:e.listQuery.number,page:e.listQuery.page},on:{"update:limit":function(t){return e.$set(e.listQuery,"number",t)},"update:page":function(t){return e.$set(e.listQuery,"page",t)},pagination:e.onGetList}}),t("dialog-insurance-bill-form",{attrs:{"data-edit":e.objectBill,"dialog-form-visible":e.dialogBillFormVisible},on:{closeDialog:e.closeDialogBillForm}}),t("dialog-show-image",{attrs:{"object-bill":e.objectBill,"dialog-visible":e.dialogShowImageVisible},on:{closeDialog:e.closeDialogShowImage}}),t("el-dialog",{attrs:{title:"Danh sách code thanh toán",visible:e.dialogCodePaymentVisible},on:{"update:visible":function(t){e.dialogCodePaymentVisible=t}}},[t("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loadingDetail,expression:"loadingDetail"}],attrs:{data:e.dataDialogCodePayment,stripe:""}},[t("el-table-column",{attrs:{label:"Code",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[e._v(" "+e._s(JSON.parse(n.request_data)?JSON.parse(n.request_data).bank_verified_code:"")+" ")]}}])}),t("el-table-column",{attrs:{prop:"created_at",label:"Ngày tạo",align:"center"}}),t("el-table-column",{attrs:{prop:"user_id",label:"User",align:"center"}}),t("el-table-column",{attrs:{prop:"status",label:"Trạng thái",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[1===a.status?t("el-tag",{attrs:{type:"success"}},[e._v("Đã thanh toán")]):t("el-tag",{attrs:{type:"danger"}},[e._v("Chưa thanh toán")])]}}])}),t("el-table-column",{attrs:{label:"QR code",align:"center"},scopedSlots:e._u([{key:"default",fn:function(n){var a=n.row;return[t("el-image",{staticStyle:{width:"150px",height:"auto"},attrs:{src:a.qr_code}}),t("el-button",{staticClass:"ml-15",attrs:{size:"mini",type:"primary",icon:"el-icon-download"},on:{click:function(t){return e.handleDownloadQR(a.qr_code)}}},[e._v("Download ")])]}}])}),t("el-table-column",{attrs:{label:"Tổng tiền",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var n=t.row;return[e._v(" "+e._s(JSON.parse(n.request_data)&&JSON.parse(n.request_data).total_pay?"".concat(e.formatNumber(JSON.parse(n.request_data).total_pay)," VNĐ"):"")+" ")]}}])})],1)],1)],1)},i=[],o=n("c7eb"),l=n("5530"),c=n("1da1"),r=(n("159b"),n("25f0"),n("3ca3"),n("ddb0"),n("9861"),n("88a7"),n("271a"),n("5494"),n("99af"),n("333d")),s=n("ff72"),u=n("e936"),d=n("b8ca"),h=n("5408"),m=n("5f87"),g=function(){var e=this,t=e._self._c;return t("section",[t("el-select",{ref:"searchAdmin",staticClass:"w-100",attrs:{clearable:"",filterable:"",size:e.size,remote:"","reserve-keyword":"",placeholder:"Tìm kiếm Admin","remote-method":e.onSearchAdmin,loading:e.loadingSearchAdmin},on:{change:e.handleSelectionChange,"hook:mounted":function(t){return e.cancalReadOnly(t,"searchAdmin")},"visible-change":function(t){return e.cancalReadOnly(t,"searchAdmin")}},model:{value:e.adminModel,callback:function(t){e.adminModel=t},expression:"adminModel"}},e._l(e.admins,(function(e){return t("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})})),1)],1)},f=[],p=n("5723"),b=new p["a"],y={name:"SearchAdmin",props:{clearData:{type:Boolean,default:!1},size:{type:String,default:"medium"}},data:function(){return{adminModel:null,admins:[],loadingSearchAdmin:!1}},methods:{onSearchAdmin:function(e){var t=this;b.Lists({name:e}).then((function(e){var n;console.log("res...............",e),t.admins=(null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.data)||[],console.log("this.admins...............",t.admins)})).finally((function(){t.loadingSearchAdmin=!1}))},handleSelectionChange:function(e){this.$emit("selection-changed-admin",this.adminModel)},cancalReadOnly:function(e,t){var n=this;this.$nextTick((function(){if(!e){var a=n.$refs[t],i=a.$el.querySelector(".el-input__inner");i.removeAttribute("readonly")}}))}}},v=y,_=n("2877"),S=Object(_["a"])(v,g,f,!1,null,null,null),k=S.exports,M=n("81fe"),O=n("7e62"),D=function(){var e=this,t=e._self._c;return t("section",[t("el-select",{ref:"searchAgencyHio",staticClass:"w-100",attrs:{filterable:"",clearable:"",size:e.size,remote:"",placeholder:"Chọn đại lý HIO","remote-method":e.onSearchAgent,loading:e.loadingSearchAgency},on:{change:e.handleSelectionChange,"hook:mounted":function(t){return e.cancelReadOnly(t,"searchAgencyHio")},"visible-change":function(t){return e.cancelReadOnly(t,"searchAgencyHio")}},model:{value:e.agencyModel,callback:function(t){e.agencyModel=t},expression:"agencyModel"}},e._l(e.agencies,(function(e){return t("el-option",{key:e.id,attrs:{label:e.name+" - "+e.code_agent,value:e}})})),1)],1)},w=[],j=(n("d81d"),n("085a")),C=new j["a"],Y={name:"SearchAgencyHIO",props:{clearData:{type:Boolean,default:!1},size:{type:String,default:"medium"}},data:function(){return{agencyModel:null,agencies:[],loadingSearchAgency:!1}},created:function(){this.onSearchAgent()},methods:{onSearchAgent:function(e){var t=this;console.log("keywords",e),this.loadingSearchAgent=!0,C.searchAgentNew({keyword:e}).then((function(e){console.log("res",e),e=e.data,0===e.error_code?(e.data=e.data.map((function(e){return{id:e.id,name:e.name,code_agent:e.code_agent,label:e.name+" - "+e.code_agent,value:e}})),t.agencies=e.data):t.$message({message:e.message,type:"error"}),console.log("this.agencies",t.agencies)})).catch((function(e){t.$message({message:e.message,type:"error"})})),this.loadingSearchAgent=!1},handleSelectionChange:function(e){this.$emit("selection-changed-agency-hio",this.agencyModel)},cancelReadOnly:function(e,t){var n=this;this.$nextTick((function(){if(!e){var a=n.$refs[t],i=a.$el.querySelector(".el-input__inner");i.removeAttribute("readonly")}}))}}},x=Y,I=Object(_["a"])(x,D,w,!1,null,null,null),T=I.exports,$=n("61f7"),P=n("bcc2"),A=n("8c04"),Q=n("5414"),B=n("c1df"),V=n.n(B),F=n("8ffd"),H=new A["a"],R=new u["a"];console.log("getAdmin()...................................",Object(m["b"])());var L=Object(m["b"])().role_admin,z=L.find((function(e){return"role_statistic"===e.name}));console.log("roleStatistic...................................",z);var G={name:"InsuranceBillIndex",components:{SearchAgencyHIO:T,SearchFacility:O["a"],SearchUser:M["a"],SearchAdmin:k,DialogShowImage:d["a"],DialogInsuranceBillForm:s["a"],Pagination:r["a"]},data:function(){return console.log("roles...................................",Object(m["b"])()),{dateRange:[],pickerOptions:{shortcuts:Q["pickerOptions"]},listQuery:{page:1,number:10},total:2e3,dataTable:[],loadingTable:!1,dialogBillFormVisible:!1,listCategory:[],listImage:[],dialogShowImageVisible:!1,objectBill:{},loadingSendMail:!1,statusSendPVI:h["n"],status:h["x"],statusInit:h["z"],statusSuccess:h["B"],statusCMSConfirm:h["y"],statusPVI:h["A"],dialogCodePaymentVisible:!1,dataDialogCodePayment:[],dataDialogImageRequest:[],roles:L,loadingDetail:!1}},watch:{dateRange:function(e){null!==e?(this.listQuery.date_start=V()(e[0]).format("YYYY-MM-DD 00:00:00"),this.listQuery.date_end=V()(e[1]).format("YYYY-MM-DD 23:59:59")):(this.listQuery.date_start=null,this.listQuery.date_end=null)}},created:function(){this.onGetList()},methods:{onResetQuery:function(){this.listQuery=Object.assign({page:1,number:10}),this.dateRange=null,this.onGetList()},convertDate:P["a"],convertDateTime:P["b"],onGetList:function(){var e=this;this.loadingTable=!0,H.cms_list_masterial_coverd(this.listQuery).then((function(t){console.log("response................",t),e.dataTable=t.data,console.log("this.total................",e.total),e.dataTable.forEach((function(e){e.is_confirm_supervisor=!0,0===e.ListHoleInspector.length&&(e.is_confirm_supervisor=!1),e.ListHoleInspector.forEach((function(t){1!==t.request_confirm&&(e.is_confirm_supervisor=!1)}))})),console.log("this.dataTable................",e.dataTable),e.loadingTable=!1}))},onExportExcel:function(){var e=this;this.loadingExportExcel=!0,R.exportExcelBill(this.listQuery).then((function(t){var n=document.createElement("a"),a=new URLSearchParams(e.listQuery).toString();n.href="".concat(F["a"],"insurance-hio/export-excel-material?").concat(a),n.setAttribute("download","proposed_file_name"),document.body.appendChild(n),n.click(),e.$message({message:"Export thành công",type:"success",duration:5e3})})).finally((function(){e.loadingExportExcel=!1}))},handleIndexMethod:function(e){return 1===this.listQuery.page?this.listQuery.page+e:(this.listQuery.page-1)*this.listQuery.number+e+1},closeDialogBillForm:function(e){!0===e.reload&&this.onGetList(),this.dialogBillFormVisible=!1,this.objectBill={}},onShowDialogImage:function(e){this.dialogShowImageVisible=!0,this.objectBill=e,console.log("this.objectBill................",this.objectBill)},closeDialogShowImage:function(){console.log("closeDialogShowImage................"),this.dialogShowImageVisible=!1,this.objectBill={}},sendMailPVI:function(e){var t=this;return Object(c["a"])(Object(o["a"])().mark((function n(){return Object(o["a"])().wrap((function(n){while(1)switch(n.prev=n.next){case 0:t.$confirm("Đã xác nhận bán. Bạn muốn tiếp tục gửi mail xác nhận bán đơn bảo hiểm sang PVI?","Cảnh báo",{confirmButtonText:"OK",cancelButtonText:"Cancel",type:"warning"}).then((function(){t.loadingSendMail=!0,console.log("sendMailPVI................",e);var n=Object(l["a"])({},e);n.total_member=n.ListUserMaterialCovered.length,console.log("dataRequest................",n);var a="https://booking.vcallid.com/api/v1/send-mail-pvi";R.sendMailConfirmSaleToPVI(n,a).then((function(n){if(console.log("response.....................",n),0!==n.error_code)return t.$message({type:"error",message:"Gửi mail thất bại"}),!1;t.$message({type:"success",message:"Gửi mail thành công"}),console.log("vào đây.....................");var a={id_material_covered:e.id,status:t.statusPVI,is_send_email:2};console.log("data.....................",a),R.confirmSaleHIO(a).then((function(e){console.log("response.....................",e),0===e.error_code?t.$message({type:"success",message:"Xác nhận bán thành công"}):t.$message({type:"error",message:"Xác nhận bán thất bại"}),t.onGetList()})).catch((function(e){console.log("error.....................",e),t.$message({type:"error",message:"Xác nhận bán thất bại"})})),t.loadingSendMail=!1})).catch((function(e){return console.log("error.....................",e),t.$message({type:"error",message:"Gửi mail thất bại"}),t.loadingSendMail=!1,!1}))})).catch((function(){return t.$message({type:"info",message:"Send mail canceled"}),!1}));case 1:case"end":return n.stop()}}),n)})))()},sendConfirmPVI:function(e){var t=this;console.log(e),this.$confirm("Đã xác nhận được tiền. Bạn muốn tiếp tục gửi xác nhận bán đơn bảo hiểm sang PVI?","Cảnh báo",{confirmButtonText:"OK",cancelButtonText:"Cancel",type:"warning"}).then((function(){var n={cms_id:Object(m["b"])().id,masterial_coverd_id:e.id};t.loadingSendMail=!0,R.pushOrderToPVI(n).then((function(e){0===e.error_code?t.$message({type:"success",message:"Gửi xác nhận bán sang PVI thành công"}):t.$message({type:"error",message:"Gửi xác nhận bán sang PVI thất bại"}),t.loadingSendMail=!1})).catch((function(e){console.log("error.....................",e),t.$message({type:"error",message:"Gửi xác nhận bán sang PVI thất bại"}),t.loadingSendMail=!1}))})).catch((function(){t.$message({type:"info",message:"Push Order canceled"})}))},confirmSale:function(e){var t=this;console.log("confirmSale................",e),this.$confirm("Bạn muốn xác nhận bán đơn bảo hiểm này?","Cảnh báo",{confirmButtonText:"OK",cancelButtonText:"Cancel",type:"warning"}).then((function(){console.log("confirmSale................",e);var n={id_material_covered:e.id,status:t.statusCMSConfirm,sale_name:Object(m["b"])().name,cms_id:Object(m["b"])().id};R.confirmSaleHIO(n).then((function(n){if(console.log("response.....................",n),0===n.error_code){t.$message({type:"success",message:"Xác nhận bán thành công"});var a=Object(l["a"])({},e);delete a.ListUserMaterialCovered,a={body_create:[{body_payment:{data_provider:Object(l["a"])(Object(l["a"])({},a),{screenSuccess:"ResultPaymentInsurance",type_hio:3}),provider:"buy_masterial_coverd",type:"bank",money:e.total_pay},user_id:e.user_id}]},R.createCodePayment(a).then((function(e){console.log("response.....................",e),0===e.error_code?t.$message({type:"success",message:"Tạo mã thanh toán thành công"}):t.$message({type:"error",message:"Tạo mã thanh toán thất bại"})})).catch((function(e){console.log("error.....................",e),t.$message({type:"error",message:"Tạo mã thanh toán thất bại"})}))}else t.$message({type:"error",message:"Xác nhận bán thất bại"});t.onGetList()})).catch((function(e){console.log("error.....................",e),t.$message({type:"error",message:"Xác nhận bán thất bại"})}))})).catch((function(){t.$message({type:"info",message:"Xác nhận bán canceled"})}))},onEdit:function(e){var t=this;console.log("onEdit................",e),R.detailBillInsurance({cms_id:Object(m["b"])().id,masterial_coverd_id:e.id}).then((function(e){console.log("res........................",e),0===e.error_code&&(t.objectBill=e.data)})),this.dialogBillFormVisible=!0},handleSelectionChangedAdmin:function(e){console.log("data................",e),this.listQuery.admin_id=e,this.onGetList()},handleSelectionChangedUser:function(e){console.log("data................",e),this.listQuery.user_id=e.value,this.onGetList()},handleSelectionChangedFacility:function(e){console.log("data................",e),this.listQuery.facility_id=e.value,this.onGetList()},handleSelectionChangedAgency:function(e){console.log("data................",e),this.listQuery.agent_id=e.id,this.onGetList()},onShowPayment:function(e){var t=this;console.log("onShowPayment................",e),this.loadingDetail=!0,R.getInfoPayment({cms_id:Object(m["b"])().id,id_material_covered:e.id}).then((function(e){console.log("getInfoPayment................",e),0===+e.error_code?(t.dataDialogCodePayment=e.data,t.loadingDetail=!1):t.loadingDetail=!1})),this.dialogCodePaymentVisible=!0},onShowImageRequest:function(e){console.log("onShowImageRequest................",e.array_img_request),this.dataDialogImageRequest=e.array_img_request.split(","),this.$viewerApi({images:this.dataDialogImageRequest})},changeSearch:function(){this.onGetList()},renderStatus:function(e){console.log("renderStatus................",e);var t="";return 2===e.status&&0===e.is_send_email?t="CMS đã xác nhận, chưa gửi mail":3===e.status&&2===e.is_send_email?t="Đã gửi mail, PVI chưa xác nhận":3===e.status&&1===e.is_send_email&&(t="Đã gửi mail, PVI đã xác nhận mail"),t},handleDownloadQR:function(e){var t=document.createElement("a");t.setAttribute("download","image.jpg"),t.setAttribute("href",e),t.click()},confirmPayment:function(e){var t=this;console.log("confirmPayment................",e),this.$confirm("Bạn có muốn xác nhận đơn bảo hiểm ID"+e.id+" này đã được thanh toán?","Xác nhận thanh toán",{confirmButtonText:"OK",cancelButtonText:"Cancel",type:"warning"}).then((function(){console.log("confirmSale................",e);var n={id_material_covered:e.id,is_pay:1,sale_name:Object(m["b"])().name,cms_id:Object(m["b"])().id};R.confirmSaleHIO(n).then((function(e){console.log("response.....................",e),0===e.error_code?(t.$message({type:"success",message:"Xác nhận thanh toán thành thành công"}),t.onGetList()):t.$message({type:"error",message:"Xác nhận thanh toán thất bại"})})).catch((function(e){console.log("error.....................",e),t.$message({type:"error",message:"Xác nhận bán thất bại"})}))})).catch((function(){t.$message({type:"info",message:"Xác nhận bán canceled"})}))},isEmpty:$["b"],formatNumber:P["k"]}},q=G,E=(n("5664"),Object(_["a"])(q,a,i,!1,null,"0da3bead",null));t["default"]=E.exports},bcc2:function(e,t,n){"use strict";n.d(t,"k",(function(){return o})),n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return r})),n.d(t,"e",(function(){return s})),n.d(t,"d",(function(){return u})),n.d(t,"f",(function(){return d})),n.d(t,"l",(function(){return h})),n.d(t,"h",(function(){return m})),n.d(t,"i",(function(){return g})),n.d(t,"j",(function(){return f})),n.d(t,"o",(function(){return p})),n.d(t,"g",(function(){return b})),n.d(t,"m",(function(){return y})),n.d(t,"n",(function(){return v}));n("2af1"),n("b680"),n("ac1f"),n("5319"),n("d3b7"),n("25f0"),n("99af"),n("fb6a"),n("a15b"),n("d81d"),n("14d9");var a=n("c1df"),i=n.n(a);function o(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:".",n=(e/1).toFixed().replace(".",",");return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,t)}function l(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";function n(e){return e<10?"0"+e:e}var a=new Date(e);return"DD/MM/YYYY"===t?[n(a.getDate()),n(a.getMonth()+1),a.getFullYear()].join("/"):"YYYY-MM-DD"===t?[n(a.getFullYear()),n(a.getMonth()+1),n(a.getDate())].join("-"):void 0}function c(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";function n(e){return e<10?"0"+e:e}var a=new Date(e),i=[n(a.getHours()),n(a.getMinutes())].join(":"),o="";return"DD/MM/YYYY"===t?o=[n(a.getDate()),n(a.getMonth()+1),a.getFullYear()].join("/"):"YYYY-MM-DD"===t&&(o=[n(a.getFullYear()),n(a.getMonth()+1),n(a.getDate())].join("-")),"".concat(i," ").concat(o)}function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";function n(e){return e<10?"0"+e:e}var a=new Date(e),i=[n(a.getHours()),n(a.getMinutes()),n(a.getSeconds())].join(":"),o="";return"DD/MM/YYYY"===t?o=[n(a.getDate()),n(a.getMonth()+1),a.getFullYear()].join("-"):"YYYY-MM-DD"===t&&(o=[n(a.getFullYear()),n(a.getMonth()+1),n(a.getDate())].join("-")),"".concat(i," ").concat(o)}function s(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"HH:mm:ss DD-MM-YYYY";function n(e){return e<10?"0"+e:e}var a=new Date(e),i=[n(a.getHours()),n(a.getMinutes()),n(a.getSeconds())].join(":"),o="";return"HH:mm:ss DD-MM-YYYY"===t?o=[n(a.getDate()),n(a.getMonth()+1),a.getFullYear()].join("-"):"YYYY-MM-DD"===t&&(o=[n(a.getFullYear()),n(a.getMonth()+1),n(a.getDate())].join("-")),"".concat(i," ").concat(o)}function u(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY",n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];function a(e){return e<10?"0"+e:e}var i=new Date(e),o=n?i.getUTCHours():i.getHours(),l=n?i.getUTCMinutes():i.getMinutes(),c=[a(o),a(l),a(i.getSeconds())].join(":"),r="";return"DD/MM/YYYY"===t?r=[a(i.getDate()),a(i.getMonth()+1),i.getFullYear()].join("-"):"YYYY-MM-DD"===t&&(r=[a(i.getFullYear()),a(i.getMonth()+1),a(i.getDate())].join("-")),"".concat(c," ").concat(r)}function d(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"YYYY-MM-DD";function n(e){return e<10?"0"+e:e}var a=new Date(e),i="";return"DD/MM/YYYY"===t?i=[n(a.getDate()),n(a.getMonth()+1),a.getFullYear()].join("/"):"YYYY-MM-DD"===t&&(i=[n(a.getFullYear()),n(a.getMonth()+1),n(a.getDate())].join("-")),"".concat(i)}function h(e){if(null==e)return null;var t=(e/1).toFixed().replace(".",",");return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}function m(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";if(e)return i()(e).format(t)}function g(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"HH:mm DD/MM/YYYY";return i()(e).format(t)}function f(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD-MM-YYYY HH:mm:ss";if(e)return i()(e).format(t)}function p(e){var t=e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[\Đ]/g,"D");return t.toUpperCase()}function b(e){switch(e){case 1:return"Tạo flight";case 2:return"Đã xác nhận";case 4:return"Hủy đúng hạn";case 5:return"Hủy sai hạn";case 6:return"Xác nhận booking";default:return"Đã hoàn thành"}}function y(e){switch(e){case 2:return"success";case 3:return"success";case 4:return"warning";case 5:return"danger";default:return"info"}}function v(e){var t=[];return e.length>0&&e.map((function(e){var n=e.id_display?e.id_display:e.id,a="vID".concat(n," - ").concat(e.fullname," (").concat(e.nickname,")"),i={value:e.id,label:a};t.push(i)})),t}}}]);