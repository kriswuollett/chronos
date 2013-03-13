define(["jquery","underscore","components/fuzzy_matcher","hbs!templates/select2_choice","components/presence_map","jquery/select2","less!styles/select2.less"],function(e,t,n,r,i){function a(e,n,r){return e||(e=[]),n||(n={}),t.extend({},{results:t.reject(e,function(e){var t=e.text,n=e.id;return!!r[t]||!!r[n]}),more:!1,context:n})}function f(e,s){var f,l,c,h,p;return f=new n.FuzzyMatcher({collection:s.collection}),l=n.getFormattedMatcher(3,f),h=s&&s.exclusions||[],p=i(h),c=t.extend({},{tokenSeparators:[","," ",", "],query:function(n){var r=l(n.term),s=e.select2("data"),o=i(t.pluck(s,"id")),u=t.extend({},p,o);n.callback(a(r,n.context,u))},createSearchChoice:function(e){return null},formatSelection:function(e,t){return r({data:e})},escapeMarkup:function(e){return e},dropdownCssClass:"fuzzy-select2-dropdown",tokenizer:function(e,t,n,r){},formatResult:function(e,n,r){var i,s,o,u,a,f;return u=e.text,a=r.term,i=e.matches,s=[],t.isEmpty(i)?t.isEmpty(u)?null:u:(o=t.chain(i).first().first().value(),s.push(u.slice(0,o)),f=t.reduce(i,function(e,t,n,r){var i=n+1,s;return s=['<span class="select2-match">',u.slice(t[0],t[1]),"</span>"],i<r.length&&t[1]!==r[i][0]?s.push(u.slice(t[1],r[i][0])):i==r.length&&s.push(u.slice(t[1])),e.concat(s)},[]),s.concat(f).join(""))},initSelection:function(e,n){var r,s,o;r=e.val().split(u),s=i(r),t.extend(p,s),o=f.collection.chain().filter(function(e){return!!s[e.get("displayName")]}).map(function(e){return{text:e.get("name"),id:e.get("name")}}).value(),n(o)}},t.omit(s,"collection","exclusions")),e.data(o,{destroy:function(){f.unobserveCollection()}}),e.select2(c).on("change",function(e){e&&e.added&&(p[e.added.id]=!0),e&&e.removed&&delete p[e.removed.id]})}function l(e){var t;return!(t=e.data(o))||(e.removeData(o),t.destroy()),e.select2("destroy")}var s={},o="airbnb.fuzzySelect2",u=", ";return t.extend(s,{attach:f,unattach:l}),s});