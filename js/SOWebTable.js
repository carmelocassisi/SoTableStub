class SOWebTable {

    constructor(options) {

        // default options
        this.options = {
            targets: {
                main: ".main",
                title: "title",
                subtitle: "subtitle",
                msgStatus: "msgStatus",
                list: "list"
            }
        };

        // merge options
        Object.assign(this.options, options);

        this.initialize();
    }

    /* ====================== Initialize Table ======================= */
    initialize() {

        var self = this;

        // prepare body for result
        $(self.options.targets.main).append("<div class='serviceSection' id='" + self.options.name + "'>" +
            "<a id='anchor_" + self.options.name + "'>" +
            "<h3 class='title text-center' id='" + self.getTargetID(self.options.targets.title) + "'>" + self.options.name + "</h3>" +
            "</a>" +
            "<div class='subtitle text-center font-weight-light font-italic' id='" + self.getTargetID(self.options.targets.subtitle) + "'>" + self.options.description + "</div>" +
            "<div class='list 'id='" + self.getTargetID(self.options.targets.list) + "'></div>" +
            "<div class='msgStatus' id='" + self.getTargetID(self.options.targets.msgStatus) + "'></div>" +
            "</div>");

        // ajax call
        self.callURL();
    }

    /* ====================== Utility functions =========================*/
    getJQueryTargetID(target) {
        var self = this;
        return "#" + self.options.name + "_" + target;
    }

    getTargetID(target) {
        var self = this;
        return self.options.name + "_" + target;
    }

    checkNullColValues(row) {

        var self = this;
        var check = true;

        try {
            var keys = Object.keys(row);
            //console.log(keys);
            for (var i = 0; i < self.options.table.notNullCols.length; i++) {
                check = check && (row[keys[i]] != null);
            }
        } catch (e) {}

        //console.log(check);
        return check;
    }

    /* ====================== Ajax call =========================*/
    callURL() {

        var self = this;

        $.ajax({
            dataType: self.options.dataType ? self.options.dataType : "json", // default dataset format = json
            url: self.options.URL,
            async: true,
            beforeSend: function() {
                self.onScreen(self.getJQueryTargetID(self.options.targets.list), "<div class=\"alert alert-secondary text-center\" role=\"alert\">Loading...</div>", false);
            },
            success: function(data) {
                try {
                    (self.options.dataType == "json") ? self.writeListFromJSON(data): self.writeListFromText(data);
                } catch (e) {
                    self.onScreen(self.getJQueryTargetID(self.options.targets.list), "<div class=\"alert alert-danger text-center\" role=\"alert\"><b>Incorrectly formatted dataset</b>: " + e + "</div>", false);
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                self.onScreen(self.getJQueryTargetID(self.options.targets.list), "<div class=\"alert alert-danger text-center\" role=\"alert\">" + thrownError + "</div>", false);
            }
        });
    }

    /* ====================== DOM elements interaction ======================= */
    onScreen(target, msg, append) {
        //console.log(target, msg);
        if (append) {
            $(target).append(msg);
        } else {
            $(target).html(msg);
        }
    }

    writeListFromJSON(data) {

        var self = this;

        //console.log(data);
        if (data.length > 0) {

            var tableID = self.getTargetID("statusTable");
            //console.log(tableID);
            var table = "<table id='" + tableID + "' width='100%' class='table table-striped table-bordered dt-responsive'>";

            // header
            table += "<thead>";
            table += "<tr>";
            var thead = Object.keys(data[0]);
            $.each(thead, function(index, key) {
                table += "<th>" + key + "</th>";
            });
            table += "</tr>";
            table += "</thead>";

            // body
            table += "<tbody>";
            $.each(data, function(index, tr) {

                if (self.checkNullColValues(tr)) {

                    table += "<tr>";
                    $.each(tr, function(index, td) {
                        // columns
                        table += "<td>" + td + "</td>";
                    });
                    table += "</tr>";
                }
            });
            table += "</tbody>";

            // footer
            table += "<tfoot>";
            table += "<tr>";
            var thead = Object.keys(data[0]);
            $.each(thead, function(index, key) {
                table += "<th>" + key + "</th>";
            });
            table += "</tr>";
            table += "</tfoot>";

            table += '</table>';

            self.onScreen(self.getJQueryTargetID(self.options.targets.list), table, false);

            if (self.options.table_options) {
                self.options.table_options.responsive = true;
            } else {
                self.options.table_options = { "responsive": true };
            }
            $("#" + tableID).dataTable(self.options.table);
        } else {
            self.onScreen(self.getJQueryTargetID(self.options.targets.list), "<p style='font-style:italic'>No data available in table</p>", false);
        }
    }

    writeListFromText(text) {

        var self = this;
        var data = text.split(/\r?\n|\r/);
        var separator = self.options.textSeparator ? self.options.textSeparator : ","; // default csv
        var header_length;

        //console.log(data);
        if (data.length > 0) {

            var tableID = self.getTargetID("statusTable");
            //console.log(tableID);
            var table = "<table id='" + tableID + "' width='100%' class='table table-striped table-bordered dt-responsive'>";

            // header
            var th = data[0].split(separator);
            header_length = th.length;
            table += "<thead>";
            table += "<tr>";
            $.each(th, function(i, key) {
                table += "<th>" + key + "</th>";
            });
            table += "</tr>";
            table += "</thead>";

            // body
            table += "<tbody>";
            for (var index = 1; index < data.length; index++) {
                var row = data[index].split(separator);
                if (row.length == header_length && self.checkNullColValues(row)) { // check for corrupted rows
                    table += "<tr>";
                    $.each(row, function(i, td) {
                        // columns
                        table += "<td>" + td + "</td>";
                    });
                    table += "</tr>";
                }
            }
            table += "</tbody>";

            // footer
            table += "<tfoot>";
            table += "<tr>";
            var th = data[0].split(separator);
            $.each(th, function(i, key) {
                table += "<th>" + key + "</th>";
            });
            table += "</tr>";
            table += "</tfoot>";

            table += '</table>';

            self.onScreen(self.getJQueryTargetID(self.options.targets.list), table, false);

            if (self.options.table_options) {
                self.options.table_options.responsive = true;
            } else {
                self.options.table_options = { "responsive": true };
            }
            $("#" + tableID).dataTable(self.options.table);
        } else {
            self.onScreen(self.getJQueryTargetID(self.options.targets.list), "<p style='font-style:italic'>No data available in table</p>", false);
        }
    }
}