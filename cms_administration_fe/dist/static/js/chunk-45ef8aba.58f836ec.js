(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-45ef8aba"],{"0538":function(t,e,a){"use strict";var n=a("e330"),r=a("59ed"),s=a("861d"),c=a("1a2d"),o=a("f36a"),i=a("40d5"),u=Function,l=n([].concat),f=n([].join),d={},g=function(t,e,a){if(!c(d,e)){for(var n=[],r=0;r<e;r++)n[r]="a["+r+"]";d[e]=u("C,a","return new C("+f(n,",")+")")}return d[e](t,a)};t.exports=i?u.bind:function(t){var e=r(this),a=e.prototype,n=o(arguments,1),c=function(){var a=l(n,o(arguments));return this instanceof c?g(e,a.length,a):e.apply(t,a)};return s(a)&&(c.prototype=a),c}},"085a":function(t,e,a){"use strict";a.d(e,"a",(function(){return l}));var n=a("d4ec"),r=a("bee2"),s=a("262e"),c=a("2caf"),o=(a("99af"),a("6c6e")),i=a("b775"),u=a("5f87"),l=function(t){Object(s["a"])(a,t);var e=Object(c["a"])(a);function a(){return Object(n["a"])(this,a),e.call(this,"sport-agent")}return Object(r["a"])(a,[{key:"list",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/all"),method:"get",params:t})}},{key:"remove",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/remove/").concat(t),method:"get"})}},{key:"create",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/create"),method:"post",data:t})}},{key:"updateStatus",value:function(t,e){return Object(i["a"])({url:"".concat(this.uri,"/update-status/").concat(e),method:"post",data:t})}},{key:"updateStatusPayment",value:function(t,e){return Object(i["a"])({url:"".concat(this.uri,"/update-status-payment/").concat(e),method:"post",data:t})}},{key:"update",value:function(t,e){return Object(i["a"])({url:"".concat(this.uri,"/update/").concat(e),method:"post",data:t})}},{key:"searchGolfer",value:function(t,e){return Object(i["a"])({url:"".concat(this.uri,"/search-golfer"),method:"POST",data:e,params:t})}},{key:"exportData",value:function(t){return i["a"].defaults.responseType="blob",Object(i["a"])({url:"".concat(this.uri,"/export-agent"),method:"POST",data:t})}},{key:"listInsurance",value:function(t,e){return Object(i["a"])({url:"".concat(this.uri,"/list-insurance"),method:"get",data:t,params:e})}},{key:"listRevenueAgent",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/list-revenue-agent"),method:"get",params:t,headers:{Authorization:"Bearer "+Object(u["e"])(),"X-Token":Object(u["d"])(),"Access-Control-Allow-Origin":"*"}})}},{key:"listTotalInsuranceByAgent",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/list-total-insurance-by-agent"),method:"get",params:t})}},{key:"listDebitInsuranceByAgent",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/list-debit-insurance-by-agent"),method:"get",params:t})}},{key:"listDebitInsuranceByAgentCode",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/list-debit-insurance-by-agent-code"),method:"get",params:t})}},{key:"listOutOfDateInsuranceByAgent",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/list-out-of-date-insurance"),method:"get",params:t})}},{key:"exportRevenueAgent",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/export-revenue-agent"),method:"get",params:t})}},{key:"onRemoveFile",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/public-remove-file"),method:"get",params:t})}},{key:"searchAgent",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/search-agent"),method:"post",data:t})}},{key:"createCodePayment",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/create-code-payment"),method:"post",data:t})}},{key:"searchAgentNew",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/search-agent-new"),method:"get",params:t})}},{key:"searchSaleNew",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/search-sale-cms"),method:"get",params:t})}},{key:"certificateItem",value:function(t){return Object(i["a"])({url:"".concat(this.uri,"/certificate-item"),method:"get",params:t})}}]),a}(o["a"])},"0ddb":function(t,e,a){},"1b3a":function(t,e,a){t.exports=a.p+"static/img/logo-pvi-new.d2eb86f8.png"},"262e":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));a("d9e2"),a("131a"),a("1f68");function n(t,e){return n=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},n(t,e)}function r(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&n(t,e)}},"2af1":function(t,e,a){"use strict";var n=a("23e7"),r=a("f748");n({target:"Math",stat:!0},{sign:r})},"2caf":function(t,e,a){"use strict";a.d(e,"a",(function(){return i}));a("4ae1"),a("d3b7"),a("f8c9"),a("131a"),a("3410"),a("1f68");function n(t){return n=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}function r(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}a("d9e2");var s=a("53ca");function c(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function o(t,e){if(e&&("object"===Object(s["a"])(e)||"function"===typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return c(t)}function i(t){var e=r();return function(){var a,r=n(t);if(e){var s=n(this).constructor;a=Reflect.construct(r,arguments,s)}else a=r.apply(this,arguments);return o(this,a)}}},"3a85":function(t,e,a){"use strict";a("0ddb")},"4ae1":function(t,e,a){"use strict";var n=a("23e7"),r=a("d066"),s=a("2ba4"),c=a("0538"),o=a("5087"),i=a("825a"),u=a("861d"),l=a("7c73"),f=a("d039"),d=r("Reflect","construct"),g=Object.prototype,h=[].push,p=f((function(){function t(){}return!(d((function(){}),[],t)instanceof t)})),m=!f((function(){d((function(){}))})),v=p||m;n({target:"Reflect",stat:!0,forced:v,sham:v},{construct:function(t,e){o(t),i(e);var a=arguments.length<3?t:o(arguments[2]);if(m&&!p)return d(t,e,a);if(t===a){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var n=[null];return s(h,n,e),new(s(c,t,n))}var r=a.prototype,f=l(u(r)?r:g),v=s(t,f,e);return u(v)?v:f}})},"6c6e":function(t,e,a){"use strict";a.d(e,"a",(function(){return c}));var n=a("d4ec"),r=a("bee2"),s=a("b775"),c=function(){function t(e){Object(n["a"])(this,t),this.uri=e}return Object(r["a"])(t,[{key:"list",value:function(t){return Object(s["a"])({url:"/"+this.uri,method:"get",params:t})}},{key:"get",value:function(t){return Object(s["a"])({url:"/"+this.uri+"/"+t,method:"get"})}},{key:"store",value:function(t){return Object(s["a"])({url:"/"+this.uri,method:"post",data:t})}},{key:"update",value:function(t,e){return Object(s["a"])({url:"/"+this.uri+"/"+t,method:"put",data:e})}},{key:"destroy",value:function(t){return Object(s["a"])({url:"/"+this.uri+"/"+t,method:"delete"})}}]),t}()},a25e:function(t,e,a){"use strict";a.r(e);a("b0c0");var n=function(){var t=this,e=t._self._c;return e("div",[e("el-row",{ref:"elementPDF",staticClass:"container",attrs:{id:"table-vue"}},[e("el-row",{staticStyle:{display:"flex"},attrs:{gutter:20}},[e("el-col",{attrs:{sm:16}},[e("img",{staticClass:"logo-pvi",attrs:{src:a("c885"),alt:""}})]),e("el-col",{attrs:{sm:8}},[e("img",{staticClass:"logo",attrs:{src:a("1b3a"),alt:""}})])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-center",attrs:{sm:24}},[e("h1",{staticClass:"text-h1"},[t._v("GIẤY CHỨNG NHẬN")]),e("h1",{staticClass:"text-h1"},[t._v("BẢO HIỂM BỒI THƯỜNG GIẢI THƯỞNG (GOLF)")])])],1),e("div",{staticClass:"form-bill"},[e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Người mua:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("CÔNG TY CỔ PHẦN DỊCH VỤ ĐẶT SÂN GOLF WGHN")])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Địa chỉ:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("20 Đường Võ Chí Công, Phường Nghĩa Đô, Quận Cầu Giấy, Hà Nội, Việt Nam")])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Số điện thoại:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("0855 846 568")])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Giải thi đấu:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v(t._s(t.certificateInsurance.name_tour))])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Mã bảo hiểm:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("BH"+t._s(t.certificateInsurance.id))])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Địa điểm:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v(t._s(t.certificateInsurance.facility.title))])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Phạm vi bảo hiểm:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("Bồi thường cho Người được bảo hiểm trách nhiệm phải trả cho giải thưởng "+t._s(t.certificateInsurance.price.name)+" trị giá "+t._s(t.formatNumber(t.certificateInsurance.price.price))+"VNĐ cho người thi đấu thắng giải "+t._s(t.certificateInsurance.name_tour))])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Thời gian thi đấu:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v(" Từ ngày "+t._s(t.convertDate(t.certificateInsurance.date_played))+" đến ngày "+t._s(t.convertDate(t.certificateInsurance.date_played)))])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Số lượng người::")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v(" "+t._s(t.certificateInsurance.money.title)+" / ngày thi đấu")])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Lỗ golf hố:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("Hố golf số "+t._s(t.certificateInsurance.hole_select))])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Khoảng cách lỗ golf:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("Nam: Tối thiểu 150 Yards, Nữ: Tối thiểu 135 Yards")])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Thời hạn bảo hiểm:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("Từ "+t._s(t.convertDateTime(t.certificateInsurance.date_played))+" đến 23:59 "+t._s(t.convertDate(t.certificateInsurance.date_played)))])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Giá trị giải thưởng:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v("Trị giá "+t._s(t.formatNumber(t.certificateInsurance.price.price))+"đ/PAX")])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Tỷ lệ phí:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v(t._s(t.certificateInsurance.money.fee)+" % (chưa bao gồm thuế GTGT)")])])],1),e("el-row",{staticClass:"form-group",attrs:{gutter:20}},[e("el-col",{staticClass:"text-name",attrs:{span:9,offset:0}},[t._v("Tổng phí bảo hiểm:")]),e("el-col",{attrs:{span:15,offset:0}},[e("b",{staticClass:"text-detail"},[t._v(t._s("".concat(t.formatNumber(t.certificateInsurance.total_pay)," VNĐ")))])])],1)],1),e("div",{staticStyle:{"padding-top":"20px"}},[e("el-row",{staticClass:"table-history"},[e("el-col",[e("el-table",{staticClass:"table-golfer",attrs:{data:t.tableData,border:""}},[e("el-table-column",{staticClass:"text-table",attrs:{type:"index",index:t.handleIndexMethod,label:"STT",width:"50"}}),e("el-table-column",{staticClass:"text-table",attrs:{label:"Họ Tên/vID"},scopedSlots:t._u([{key:"default",fn:function(a){return[-1!==a.row.user_id?e("p",[t._v(" "+t._s(a.row.fullname)+" - vID"+t._s(a.row.user_id)+" ")]):e("p",[t._v(" "+t._s(a.row.name_user)+" - vID"+t._s(a.row.user_id)+" ")])]}}])}),e("el-table-column",{staticClass:"text-table",attrs:{prop:"passport",label:"Ngày sinh/Passport"}})],1)],1)],1)],1),e("el-row",{staticStyle:{"margin-top":"20px"}},[e("el-col",{staticClass:"text-note"},[e("b",{staticClass:"text-rule"},[t._v(". Điều khoản bảo hiểm:")]),t._v(' Theo Quy tắc bảo hiểm bồi thường giải thưởng gôn "Hole in one" ban hành kèm theo Quyết định số 1269 /QĐ PVIBH ngày 31 tháng 12 năm 2013 của Tổng giám đốc Tổng công ty Bảo hiểm PVI ')]),e("el-col",{staticClass:"text-note"},[e("b",{staticClass:"text-rule"},[t._v(". Quyền tài phán:")]),t._v(" Việt Nam ")]),e("el-col",{staticClass:"text-note"},[e("b",{staticClass:"text-rule"},[t._v(". Giới hạn lãnh thổ:")]),t._v(" Việt Nam ")]),e("el-col",{staticClass:"text-note"},[e("b",{staticClass:"text-rule"},[t._v(". Điều khoản thanh toán:")]),t._v(" Thanh toán một (01) lần phí bảo hiểm bằng tiền mặt hoặc chuyển khoản trước ngày "+t._s(t.convertDate(t.certificateInsurance.date_played))+". ")])],1),e("div",{staticStyle:{"margin-top":"20px"}},[e("el-link",{on:{click:function(e){return t.exportToPDF()}}},[t._v("Download to PDF")])],1)],1)],1)},r=[],s=a("bcc2"),c=a("d67e"),o=a.n(c),i=a("085a"),u=a("c1df"),l=a.n(u),f=new i["a"],d={name:"CertificateInsuranceItem",data:function(){return{certificateInsurance:{},loading:!1,tableData:[],from:1,dateEnd:"",date:""}},watch:{},mounted:function(){this.getCertificateInsurance()},methods:{getCertificateInsurance:function(){var t=this,e=window.location.href;console.log(e);var a={id:e.substring(e.lastIndexOf("/")+1)};f.certificateItem(a).then((function(e){console.log("ssssssssss",e),0===e.data.error_code?(t.loading=!1,console.log("data",e),t.certificateInsurance=e.data.data,t.tableData=e.data.data.member_insurance,t.date=l()(e.data.data.date_played).add(2,"days").calendar(),t.dateEnd=l()(t.date).format("DD/MM/yyyy"),console.log(t.dateEnd)):t.$message.warning(e.message)}))},handleIndexMethod:function(t){return this.from+t},exportToPDF:function(){var t=document.getElementById("table-vue"),e={margin:1,filename:"certificate.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:3},jsPDF:{unit:"in",format:"a3",orientation:"portrait"}};o()().set(e).from(t).save(),o()(t,e)},exportToPDFNEW:function(){var t=document.getElementById("table-vue-translation"),e={margin:1,filename:"certificate-insurance.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:3},jsPDF:{unit:"in",format:"a3",orientation:"portrait"}};o()().set(e).from(t).save(),o()(t,e)},formatNumber:s["k"],convertDateTime:s["b"],convertDate:s["a"]}},g=d,h=(a("3a85"),a("2877")),p=Object(h["a"])(g,n,r,!1,null,"23d54b3f",null);e["default"]=p.exports},bcc2:function(t,e,a){"use strict";a.d(e,"k",(function(){return s})),a.d(e,"a",(function(){return c})),a.d(e,"b",(function(){return o})),a.d(e,"c",(function(){return i})),a.d(e,"e",(function(){return u})),a.d(e,"d",(function(){return l})),a.d(e,"f",(function(){return f})),a.d(e,"l",(function(){return d})),a.d(e,"h",(function(){return g})),a.d(e,"i",(function(){return h})),a.d(e,"j",(function(){return p})),a.d(e,"o",(function(){return m})),a.d(e,"g",(function(){return v})),a.d(e,"m",(function(){return b})),a.d(e,"n",(function(){return y}));a("2af1"),a("b680"),a("ac1f"),a("5319"),a("d3b7"),a("25f0"),a("99af"),a("fb6a"),a("a15b"),a("d81d"),a("14d9");var n=a("c1df"),r=a.n(n);function s(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:".",a=(t/1).toFixed().replace(".",",");return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,e)}function c(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";function a(t){return t<10?"0"+t:t}var n=new Date(t);return"DD/MM/YYYY"===e?[a(n.getDate()),a(n.getMonth()+1),n.getFullYear()].join("/"):"YYYY-MM-DD"===e?[a(n.getFullYear()),a(n.getMonth()+1),a(n.getDate())].join("-"):void 0}function o(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";function a(t){return t<10?"0"+t:t}var n=new Date(t),r=[a(n.getHours()),a(n.getMinutes())].join(":"),s="";return"DD/MM/YYYY"===e?s=[a(n.getDate()),a(n.getMonth()+1),n.getFullYear()].join("/"):"YYYY-MM-DD"===e&&(s=[a(n.getFullYear()),a(n.getMonth()+1),a(n.getDate())].join("-")),"".concat(r," ").concat(s)}function i(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";function a(t){return t<10?"0"+t:t}var n=new Date(t),r=[a(n.getHours()),a(n.getMinutes()),a(n.getSeconds())].join(":"),s="";return"DD/MM/YYYY"===e?s=[a(n.getDate()),a(n.getMonth()+1),n.getFullYear()].join("-"):"YYYY-MM-DD"===e&&(s=[a(n.getFullYear()),a(n.getMonth()+1),a(n.getDate())].join("-")),"".concat(r," ").concat(s)}function u(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"HH:mm:ss DD-MM-YYYY";function a(t){return t<10?"0"+t:t}var n=new Date(t),r=[a(n.getHours()),a(n.getMinutes()),a(n.getSeconds())].join(":"),s="";return"HH:mm:ss DD-MM-YYYY"===e?s=[a(n.getDate()),a(n.getMonth()+1),n.getFullYear()].join("-"):"YYYY-MM-DD"===e&&(s=[a(n.getFullYear()),a(n.getMonth()+1),a(n.getDate())].join("-")),"".concat(r," ").concat(s)}function l(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY",a=arguments.length>2&&void 0!==arguments[2]&&arguments[2];function n(t){return t<10?"0"+t:t}var r=new Date(t),s=a?r.getUTCHours():r.getHours(),c=a?r.getUTCMinutes():r.getMinutes(),o=[n(s),n(c),n(r.getSeconds())].join(":"),i="";return"DD/MM/YYYY"===e?i=[n(r.getDate()),n(r.getMonth()+1),r.getFullYear()].join("-"):"YYYY-MM-DD"===e&&(i=[n(r.getFullYear()),n(r.getMonth()+1),n(r.getDate())].join("-")),"".concat(o," ").concat(i)}function f(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"YYYY-MM-DD";function a(t){return t<10?"0"+t:t}var n=new Date(t),r="";return"DD/MM/YYYY"===e?r=[a(n.getDate()),a(n.getMonth()+1),n.getFullYear()].join("/"):"YYYY-MM-DD"===e&&(r=[a(n.getFullYear()),a(n.getMonth()+1),a(n.getDate())].join("-")),"".concat(r)}function d(t){if(null==t)return null;var e=(t/1).toFixed().replace(".",",");return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}function g(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD/MM/YYYY";if(t)return r()(t).format(e)}function h(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"HH:mm DD/MM/YYYY";return r()(t).format(e)}function p(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"DD-MM-YYYY HH:mm:ss";if(t)return r()(t).format(e)}function m(t){var e=t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[\Đ]/g,"D");return e.toUpperCase()}function v(t){switch(t){case 1:return"Tạo flight";case 2:return"Đã xác nhận";case 4:return"Hủy đúng hạn";case 5:return"Hủy sai hạn";case 6:return"Xác nhận booking";default:return"Đã hoàn thành"}}function b(t){switch(t){case 2:return"success";case 3:return"success";case 4:return"warning";case 5:return"danger";default:return"info"}}function y(t){var e=[];return t.length>0&&t.map((function(t){var a=t.id_display?t.id_display:t.id,n="vID".concat(a," - ").concat(t.fullname," (").concat(t.nickname,")"),r={value:t.id,label:n};e.push(r)})),e}},bee2:function(t,e,a){"use strict";a.d(e,"a",(function(){return s}));var n=a("a38e");function r(t,e){for(var a=0;a<e.length;a++){var r=e[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,Object(n["a"])(r.key),r)}}function s(t,e,a){return e&&r(t.prototype,e),a&&r(t,a),Object.defineProperty(t,"prototype",{writable:!1}),t}},c885:function(t,e,a){t.exports=a.p+"static/img/LogowHIO.f26a2f56.png"},d4ec:function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));a("d9e2");function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},f748:function(t,e,a){"use strict";t.exports=Math.sign||function(t){var e=+t;return 0===e||e!==e?e:e<0?-1:1}},f8c9:function(t,e,a){"use strict";var n=a("23e7"),r=a("da84"),s=a("d44e");n({global:!0},{Reflect:{}}),s(r.Reflect,"Reflect",!0)}}]);