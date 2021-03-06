import {
   Grid,
   HtmlElement,
   Button,
   Submenu,
   Menu,
   Icon,
   Checkbox,
   TextField,
   LookupField,
   NumberField,
} from "cx/widgets";
import { Content, Controller, KeySelection, bind } from "cx/ui";
import { Format } from "cx/util";
import { casual } from "../../casual";

class PageController extends Controller {
   onInit() {
      this.store.init("$page.grid", {
         columns: {
            name: { visible: true },
            continent: { visible: true },
         },
      });

      //init grid data
      if (!this.store.get("$page.records")) this.shuffle();
   }

   shuffle() {
      this.store.set(
         "$page.records",
         Array.from({ length: 1000 }).map((v, i) => ({
            id: i + 1,
            fullName: casual.full_name,
            continent: casual.continent,
            browser: casual.browser,
            os: casual.operating_system,
            visits: casual.integer(1, 100),
         }))
      );
   }
}

export default (
   <cx>
      <div controller={PageController} style="padding: 20px">
         <p>
            <Button onClick="shuffle">Shuffle</Button>
         </p>
         <Grid
            records:bind="$page.records"
            scrollable
            buffered
            style="height: 800px;"
            lockColumnWidths
            cached
            columns={[
               { header: "#", field: "index", sortable: true, value: { bind: "$index" } },
               {
                  header: {
                     text: "Name",
                  },
                  field: "fullName",
                  visible: bind("$page.grid.columns.name.visible"),
                  sortable: true,
                  editor: (
                     <cx>
                        <TextField value-bind="$record.fullName" style="width: 100%" autoFocus required visited />
                     </cx>
                  ),
               },
               {
                  header: "Dummy",
                  visible: false,
               },
               {
                  header: "Continent",
                  field: "continent",
                  sortable: true,
                  editor: (
                     <cx>
                        <TextField value-bind="$record.continent" style="width: 100%" autoFocus />
                     </cx>
                  ),
               },
               {
                  header: "Browser",
                  field: "browser",
                  sortable: true,
                  editor: (
                     <cx>
                        <LookupField
                           value-bind="$record.browser"
                           required
                           autoOpen
                           submitOnEnterKey
                           options={[
                              { id: "Opera", text: "Opera" },
                              { id: "Safari", text: "Safari" },
                              { id: "Chrome", text: "Chrome" },
                              { id: "Firefox", text: "Firefox" },
                              { id: "Edge", text: "Edge" },
                              { id: "Internet Explorer", text: "Internet Explorer" },
                           ]}
                        />
                     </cx>
                  ),
               },
               { header: "OS", field: "os", sortable: true },
               {
                  header: "Visits",
                  field: "visits",
                  sortable: true,
                  align: "right",
                  editor: (
                     <cx>
                        <NumberField value-bind="$record.visits" />
                     </cx>
                  ),
               },
            ]}
            cellEditable
            onCellEdited={(data, ...args) => {
               //console.log("EDIT", data.oldData, data.newData, data.oldData === data.newData);
               console.log("EDIT", data, ...args);
            }}
            selection={{
               type: KeySelection,
               bind: "selection",
               multiple: true,
            }}
         />
      </div>
   </cx>
);
