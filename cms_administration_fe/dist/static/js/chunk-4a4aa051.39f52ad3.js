(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4a4aa051"],{"0419":function(t,e,a){"use strict";a.d(e,"a",(function(){return p}));var n=a("d4ec"),r=a("bee2"),o=a("262e"),i=a("2caf"),u=(a("99af"),a("6c6e")),c=a("b775"),l="https://prod-wap-wghn-beta.vcallid.com",s="https://parter_dev.vcallid.com/api/v1/cms-stb",d="https://api-payment-prod.vcallid.com/api/v1/paymenthub";console.log("URL_API_PAYMENT_HUB_________",d);var p=function(t){Object(o["a"])(a,t);var e=Object(i["a"])(a);function a(){return Object(n["a"])(this,a),e.call(this,"booking-pax")}return Object(r["a"])(a,[{key:"listBill",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/list-bill"),method:"post",data:t})}},{key:"detailBill",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/detail-bill"),method:"post",data:t})}},{key:"searchTeeTime",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/search-tee"),method:"post",data:t})}},{key:"listTeeTime",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/list-tee"),method:"post",data:t})}},{key:"createBooking",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/create-booking"),method:"post",data:t})}},{key:"updateBooking",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-bill"),method:"post",data:t})}},{key:"removeBooking",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/remove-bill"),method:"post",data:t})}},{key:"updateLockPax",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-lock-pax"),method:"post",data:t})}},{key:"updateLockPaxMultiple",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/updateLockPaxMultiple"),method:"post",data:t})}},{key:"searchOtherService",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/search-product"),method:"get",params:t})}},{key:"detailProduct",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/detail-product"),method:"get",params:t})}},{key:"searchInsurance",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/get-list-insurance"),method:"get",params:t})}},{key:"checkTimeMoneyInsurance",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/check-time-money-insurance"),method:"post",data:t})}},{key:"billConfirm",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/confirm-bill"),method:"post",data:t})}},{key:"mapUserByPhone",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/map-user-by-phone"),method:"post",data:t})}},{key:"createMiSaVoucher",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/create-misa-voucher"),method:"post",data:t})}},{key:"confirmPaymentBill",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/comfirm-payment-general-bill"),method:"post",data:t})}},{key:"updatePricePax",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/sale-pax"),method:"post",data:t})}},{key:"getCardByUser",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/get-card-by-user"),method:"post",data:t})}},{key:"getBookingDayDebt",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/check-day-debt-by-admin"),method:"post",data:t})}},{key:"getWarningBookingDayDebt",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/warning-day-debt-by-admin"),method:"post",data:t})}},{key:"updateAccountant",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-accountant"),method:"post",data:t})}},{key:"sendMailFacility",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/send-mail-facility"),method:"post",data:t})}},{key:"sendMailSacombank",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/send-mail-sacombank"),method:"post",data:t})}},{key:"exportBill",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/export-bill"),method:"post",data:t})}},{key:"getDetailCodePaymentBooking",value:function(t){return Object(c["a"])({url:"https://api-other-services.vcallid.com/api/v1/other_services/list_transaction_booking_by_pax",method:"post",data:t})}},{key:"createCodePaymentBooking",value:function(t,e){return Object(c["a"])({url:"https://api-booking-v2.vcallid.com/api/v1/payment_booking/create_payment_booking_for_cms?"+e,method:"post",data:t})}},{key:"listCategory",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/list-category"),method:"get",params:t})}},{key:"updateCategory",value:function(t,e){return Object(c["a"])({url:"".concat(this.uri,"/update-category/").concat(e),method:"post",data:t})}},{key:"createCategory",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/create-category"),method:"post",data:t})}},{key:"listDataUser",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/list-data-user"),method:"get",params:t})}},{key:"listRequestOrder",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/list-request-order"),method:"get",params:t})}},{key:"updateStatusConfirmRequest",value:function(t,e){return Object(c["a"])({url:"".concat(this.uri,"/update-status-confirm-request/").concat(e),method:"post",data:t})}},{key:"listHistoryLog",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/list-history-log"),method:"get",params:t})}},{key:"detailHistoryLog",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/detail-history-log"),method:"get",params:t})}},{key:"listPaymentPoint",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/list-payment-point"),method:"post",data:t})}},{key:"updateStatisticBill",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-statistic-bill"),method:"post",data:t})}},{key:"updateBookedSurchargeEntryPrice",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-booked-surcharge-entry-price"),method:"post",data:t})}},{key:"updateSuplierBill",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-supplier-bill"),method:"post",data:t})}},{key:"confirmExpense",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/confirm-expense"),method:"post",data:t})}},{key:"updatePaymentServiceChildStatistic",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-payment-service-child-statistic"),method:"post",data:t})}},{key:"updatePaymentBillCodePaymnet",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-payment-bill-code-payment"),method:"post",data:t})}},{key:"updateDataJson",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update-data-json"),method:"post",data:t})}},{key:"searchAgentNew",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/search-agent"),method:"get",params:t})}},{key:"createInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/create-insurance"),method:"post",data:t})}},{key:"getFacilityCanBuyInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-facility-can-buy-insurance"),method:"get",params:t})}},{key:"getListsPriceByHoleInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-list-price-by-hole-insurance"),method:"get",params:t})}},{key:"getGolferByIdInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-golfer-by-id-insurance"),method:"get",params:t})}},{key:"onCheckGolferId",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/check-golfer-id-cms"),method:"post",data:t})}},{key:"onCheckGolferPassport",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/check-golfer-passport-cms"),method:"post",data:t})}},{key:"onCheckGolferSoldInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/check-golfer-sold-insurance"),method:"post",data:t})}},{key:"getListsOptionsMember",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-list-option-member"),method:"get",params:t})}},{key:"getDetailInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-detail-insurance-cms"),method:"get",params:t})}},{key:"onGetHoleSelectInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-hole-insurance-cms"),method:"get",params:t})}},{key:"onUpdateOrCreateMember",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/create-member-insurance-cms"),method:"post",data:t})}},{key:"onDeleteMemberInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/delete-member-insurance-cms"),method:"post",data:t})}},{key:"onCreateUserNameInsuranceOut",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/create-member-insurance-out-cms"),method:"post",data:t})}},{key:"onGetMemberInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-member-insurance-cms"),method:"get",params:t})}},{key:"updateInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/update-insurance"),method:"post",data:t})}},{key:"viewCertificateInsurance",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-certificate-cms"),method:"get",params:t})}},{key:"getDetailBillCore",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/get-detail-bill-core"),method:"get",params:t})}},{key:"getCardByUserSTB",value:function(t){return Object(c["a"])({url:"".concat(s,"/get_list_free_golf"),method:"get",params:t})}},{key:"createCodePaymentGeneralBill",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/create-code-payment-general-bill"),method:"post",data:t})}},{key:"getDetailCodePaymentGeneralBill",value:function(t){return Object(c["a"])({url:"https://api-payment-prod.vcallid.com/api/v1/paymenthub/get_code_payment_by_bill",method:"post",data:t})}},{key:"getFacilitySTB",value:function(t){return Object(c["a"])({url:"".concat(s,"/get_location_id"),method:"get",params:t})}},{key:"listBillSearchArrayGB",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/list-bill-search-array-GB"),method:"post",data:t})}},{key:"addProviderToTransactionMoneyIn",value:function(t){return Object(c["a"])({url:"".concat(this.uri,"/add-provider-to-transaction-money-in"),method:"post",data:t})}},{key:"clearCodePaymentStatus",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/clear-code-payment-status"),method:"post",data:t})}},{key:"getRevenueBillBySale",value:function(t){return Object(c["a"])({url:d+"/get_revenue_bill",method:"post",data:t})}},{key:"getDataCompanyByTaxCode",value:function(t){return Object(c["a"])({url:"https://api-payment-prod.vcallid.com/api/v1/misa/get_data_company_by_tax_code",method:"post",data:t})}},{key:"get_account_object",value:function(t){return Object(c["a"])({url:"https://api-payment-prod.vcallid.com/api/v1/misa/get_account_object",method:"post",data:t})}},{key:"warningTeetimeByAdmin",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/warning-teetime-by-admin"),method:"post",data:t})}},{key:"updateDateDebt",value:function(t){return Object(c["a"])({url:l+"/".concat(this.uri,"/update_date_debt"),method:"post",data:t})}}]),a}(u["a"])},"0538":function(t,e,a){"use strict";var n=a("e330"),r=a("59ed"),o=a("861d"),i=a("1a2d"),u=a("f36a"),c=a("40d5"),l=Function,s=n([].concat),d=n([].join),p={},h=function(t,e,a){if(!i(p,e)){for(var n=[],r=0;r<e;r++)n[r]="a["+r+"]";p[e]=l("C,a","return new C("+d(n,",")+")")}return p[e](t,a)};t.exports=c?l.bind:function(t){var e=r(this),a=e.prototype,n=u(arguments,1),i=function(){var a=s(n,u(arguments));return this instanceof i?h(e,a.length,a):e.apply(t,a)};return o(a)&&(i.prototype=a),i}},"0df4":function(t,e,a){"use strict";a("eac1")},"262e":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));a("d9e2"),a("131a"),a("1f68");function n(t,e){return n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},n(t,e)}function r(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&n(t,e)}},"2caf":function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));a("4ae1"),a("d3b7"),a("f8c9"),a("131a"),a("3410"),a("1f68");function n(t){return n=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}function r(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}a("d9e2");var o=a("53ca");function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function u(t,e){if(e&&("object"===Object(o["a"])(e)||"function"===typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return i(t)}function c(t){var e=r();return function(){var a,r=n(t);if(e){var o=n(this).constructor;a=Reflect.construct(r,arguments,o)}else a=r.apply(this,arguments);return u(this,a)}}},"333d":function(t,e,a){"use strict";var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"pagination-container",class:{hidden:t.hidden}},[e("el-pagination",t._b({attrs:{background:t.background,"current-page":t.currentPage,"page-size":t.pageSize,layout:t.layout,"page-sizes":t.pageSizes,total:t.total},on:{"update:currentPage":function(e){t.currentPage=e},"update:current-page":function(e){t.currentPage=e},"update:pageSize":function(e){t.pageSize=e},"update:page-size":function(e){t.pageSize=e},"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}},"el-pagination",t.$attrs,!1))],1)},r=[];a("a9e3");Math.easeInOutQuad=function(t,e,a,n){return t/=n/2,t<1?a/2*t*t+e:(t--,-a/2*(t*(t-2)-1)+e)};var o=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}();function i(t){document.documentElement.scrollTop=t,document.body.parentNode.scrollTop=t,document.body.scrollTop=t}function u(){return document.documentElement.scrollTop||document.body.parentNode.scrollTop||document.body.scrollTop}function c(t,e,a){var n=u(),r=t-n,c=20,l=0;e="undefined"===typeof e?500:e;var s=function t(){l+=c;var u=Math.easeInOutQuad(l,n,r,e);i(u),l<e?o(t):a&&"function"===typeof a&&a()};s()}var l={name:"Pagination",props:{total:{required:!0,type:Number},page:{type:Number,default:1},limit:{type:Number,default:10},pageSizes:{type:Array,default:function(){return[10,15]}},layout:{type:String,default:"total, sizes, prev, pager, next, jumper"},background:{type:Boolean,default:!0},autoScroll:{type:Boolean,default:!0},hidden:{type:Boolean,default:!1}},computed:{currentPage:{get:function(){return this.page},set:function(t){this.$emit("update:page",t)}},pageSize:{get:function(){return this.limit},set:function(t){this.$emit("update:limit",t)}}},methods:{handleSizeChange:function(t){this.$emit("pagination",{page:this.currentPage,limit:t}),this.autoScroll&&c(0,800)},handleCurrentChange:function(t){this.$emit("pagination",{page:t,limit:this.pageSize}),this.autoScroll&&c(0,800)}}},s=l,d=(a("0df4"),a("2877")),p=Object(d["a"])(s,n,r,!1,null,"2f2d1216",null);e["a"]=p.exports},"4ae1":function(t,e,a){"use strict";var n=a("23e7"),r=a("d066"),o=a("2ba4"),i=a("0538"),u=a("5087"),c=a("825a"),l=a("861d"),s=a("7c73"),d=a("d039"),p=r("Reflect","construct"),h=Object.prototype,m=[].push,f=d((function(){function t(){}return!(p((function(){}),[],t)instanceof t)})),y=!d((function(){p((function(){}))})),b=f||y;n({target:"Reflect",stat:!0,forced:b,sham:b},{construct:function(t,e){u(t),c(e);var a=arguments.length<3?t:u(arguments[2]);if(y&&!f)return p(t,e,a);if(t===a){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var n=[null];return o(m,n,e),new(o(i,t,n))}var r=a.prototype,d=s(l(r)?r:h),b=o(t,d,e);return l(b)?b:d}})},"6c6e":function(t,e,a){"use strict";a.d(e,"a",(function(){return i}));var n=a("d4ec"),r=a("bee2"),o=a("b775"),i=function(){function t(e){Object(n["a"])(this,t),this.uri=e}return Object(r["a"])(t,[{key:"list",value:function(t){return Object(o["a"])({url:"/"+this.uri,method:"get",params:t})}},{key:"get",value:function(t){return Object(o["a"])({url:"/"+this.uri+"/"+t,method:"get"})}},{key:"store",value:function(t){return Object(o["a"])({url:"/"+this.uri,method:"post",data:t})}},{key:"update",value:function(t,e){return Object(o["a"])({url:"/"+this.uri+"/"+t,method:"put",data:e})}},{key:"destroy",value:function(t){return Object(o["a"])({url:"/"+this.uri+"/"+t,method:"delete"})}}]),t}()},"709c":function(t,e,a){"use strict";a("fbb8")},bee2:function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));var n=a("a38e");function r(t,e){for(var a=0;a<e.length;a++){var r=e[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,Object(n["a"])(r.key),r)}}function o(t,e,a){return e&&r(t.prototype,e),a&&r(t,a),Object.defineProperty(t,"prototype",{writable:!1}),t}},c5a4:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t._self._c;return e("el-row",{staticStyle:{margin:"20px"}},[e("el-row",[e("el-col",{attrs:{sm:18}},[e("h3",{staticStyle:{margin:"0",width:"100%",padding:"10px"}},[t._v("Thông tin user")])])],1),e("div",{staticClass:"clearfix-20"}),e("div",{staticClass:"filter-container"},[e("el-row",[e("el-col",{staticClass:"mr-10",attrs:{sm:4}},[e("el-input",{attrs:{placeholder:"Tìm kiếm theo id"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleFilter.apply(null,arguments)}},model:{value:t.query.user_id,callback:function(e){t.$set(t.query,"user_id",e)},expression:"query.user_id"}})],1),e("el-col",{staticClass:"mr-10",attrs:{sm:4}},[e("el-input",{attrs:{placeholder:"Tìm kiếm theo name"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleFilter.apply(null,arguments)}},model:{value:t.query.name_out_system,callback:function(e){t.$set(t.query,"name_out_system",e)},expression:"query.name_out_system"}})],1),e("el-col",{staticClass:"mr-10",attrs:{sm:4}},[e("el-input",{attrs:{placeholder:"Tìm kiếm theo CCCD / Passport"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleFilter.apply(null,arguments)}},model:{value:t.query.passport,callback:function(e){t.$set(t.query,"passport",e)},expression:"query.passport"}})],1),e("el-col",{staticClass:"mr-10",attrs:{sm:6}},[e("el-button",{attrs:{icon:"el-icon-refresh",round:""},on:{click:t.onReset}},[t._v("Reset")]),e("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:t.handleFilter}},[t._v(" Tìm kiếm ")]),e("el-button",{attrs:{type:"primary",icon:"el-icon-download",loading:t.loadingExportExcel},on:{click:t.handleDownload}},[t._v(" Export excel")])],1)],1)],1),e("div",{staticClass:"clearfix-10"}),e("el-row",{staticStyle:{"margin-top":"40px"}},[e("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loadingTable,expression:"loadingTable"}],staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""}},[e("el-table-column",{attrs:{label:"STT",width:"100",align:"center",type:"index",index:t.handleIndexMethod}}),e("el-table-column",{attrs:{prop:"pax_id",label:"Pax id",align:"center"}}),e("el-table-column",{attrs:{prop:"user_id",label:"User id",align:"center"}}),e("el-table-column",{attrs:{prop:"name_out_system",label:"User name",align:"center"}}),e("el-table-column",{attrs:{prop:"passport",label:"CCCD / Passport",align:"center"}})],1),e("el-row",{staticClass:"list-device__footer"},[e("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>t.query.limit,expression:"total > query.limit"}],attrs:{total:t.total,limit:t.query.limit,page:t.query.page},on:{"update:limit":function(e){return t.$set(t.query,"limit",e)},"update:page":function(e){return t.$set(t.query,"page",e)},pagination:t.onGetList}})],1)],1)],1)},r=[],o=a("c7eb"),i=a("2909"),u=a("1da1"),c=(a("d3b7"),a("99af"),a("3ca3"),a("ddb0"),a("d81d"),a("333d")),l=a("0419"),s=new l["a"],d={name:"DataUser",components:{Pagination:c["a"]},data:function(){return{loadingTable:!1,tableData:[],query:{limit:10,page:1},total:0,loadingExportExcel:!1}},created:function(){this.onGetList()},methods:{onGetList:function(){var t=this;this.loadingTable=!0,s.listDataUser(this.query).then((function(e){if(0===e.error_code){console.log("==============",e);var a=e.data;t.tableData=a.data,t.total=a.total}else t.$message.error("Lỗi hệ thống, vui lòng liên hệ bộ phận kỹ thuật")})).finally((function(){t.loadingTable=!1}))},handleFilter:function(){this.query.page=1,this.loadingTable=!0,this.onGetList()},handleIndexMethod:function(t){return 1===this.query.page?this.query.page+t:(this.query.page-1)*this.query.limit+t+1},onReset:function(){this.query=Object.assign({},{limit:10,page:1}),this.onGetList()},handleDownload:function(){var t=this;return Object(u["a"])(Object(o["a"])().mark((function e(){var n,r,u,c;return Object(o["a"])().wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=!1,r={page:1,limit:1e3},r.name_out_system=t.query.name_out_system,r.passport=t.query.passport,r.user_id=t.query.user_id,u=[],t.loadingExportExcel=!0;case 7:if(n){e.next=26;break}return e.prev=8,e.next=11,s.listDataUser(r);case 11:c=e.sent,console.log("res..............",c.data.data),console.log("this.tableData",c.data.data),c.data.data.length<=0&&(n=!0),u=[].concat(Object(i["a"])(u),Object(i["a"])(c.data.data)),console.log("list_all",u),0===c.error_code&&(n=!0),e.next=24;break;case 20:e.prev=20,e.t0=e["catch"](8),console.error(e.t0),n=!0;case 24:e.next=7;break;case 26:t.loadingExportExcel=!1,Promise.all([a.e("chunk-6e83591c"),a.e("chunk-5164a781"),a.e("chunk-39e3bbe0"),a.e("chunk-252e8a1a")]).then(a.bind(null,"4bf8")).then((function(e){var a=["Pax id","User id","Tên","Passport"],n=["pax_id","user_id","name_out_system","passport"],r=u;r=t.formatJson(n,r),e.export_json_to_excel({header:a,data:r,filename:"data-list"}),t.$message({message:"Export thành công",type:"success",duration:5e3})}));case 28:case"end":return e.stop()}}),e,null,[[8,20]])})))()},formatJson:function(t,e){return e.map((function(e){return t.map((function(t){return e[t]}))}))}}},p=d,h=(a("709c"),a("2877")),m=Object(h["a"])(p,n,r,!1,null,"12670cc4",null);e["default"]=m.exports},d4ec:function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));a("d9e2");function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},eac1:function(t,e,a){},f8c9:function(t,e,a){"use strict";var n=a("23e7"),r=a("da84"),o=a("d44e");n({global:!0},{Reflect:{}}),o(r.Reflect,"Reflect",!0)},fbb8:function(t,e,a){}}]);