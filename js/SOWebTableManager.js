class SOWebTableManager {

    constructor(options) {
        this.options = Object.assign({}, options);
        this.wsArray = new Array(); // array containing each scenario's service
        this.initialize();
    }

    ISODateString(d) {
        function pad(n) { return n < 10 ? '0' + n : n }
        return d.getUTCFullYear() + '-' +
            pad(d.getUTCMonth() + 1) + '-' +
            pad(d.getUTCDate()) + ' ' +
            pad(d.getUTCHours()) + ':' +
            pad(d.getUTCMinutes()) + ':' +
            pad(d.getUTCSeconds())
    }

    initialize() {

        var self = this;

        $.ajax({
            dataType: "json",
            url: "php/getScenario.php",
            data: {
                'scenario': self.options.scenario
            },
            success: function(response) {
                //console.log(response);
                if (response) {

                    var options;

                    // set scenario's title
                    if (response.Title) {
                        $(document).attr("title", response.Title);
                        $(".header span.title").html(response.Title);
                    }
                    if (response.Description) {
                        $(".header div.subtitle").html(response.Description);
                    }
                    if (response.options) {
                        options = response.options;
                    }

                    // set time on header
                    if (options && options.showCurrentTimeUTC) {
                        var curTime = new Date();
                        var timeStr = "<span style='color:#ff0'>Loaded at " + self.ISODateString(curTime) + " UTC</span>";
                        $(".header div.header-info").append(timeStr);
                    }

                    // set autorefresh on header
                    if (options && options.refreshInterval) {
                        $(".header div.header-info").append("&nbsp;<a href='javascript:location.reload()'>[Reload page]</a>&nbsp;");
                        self.setCountDown(options.refreshInterval);
                        $(".header div.header-info").append("&nbsp;Automatic reload within <span id='refreshIntervalCounter' style='color:magenta'>" + options.refreshInterval + "</span> seconds&nbsp;");
                    }

                    $.each(response["services"], function(index, item) {
                        var config = {
                            'description': item.Description,
                            'name': item.ID,
                            'URL': item.URL,
                            "dataType": item.dataType ? item.dataType : "json", // default datatype json
                            "textSeparator": item.textSeparator ? item.textSeparator : "," // default csv for text datatypes
                        };
                        if (item.table_options) {
                            config['table'] = item.table_options;
                        }
                        //console.log(config);
                        self.wsArray.push(new SOWebTable(config)); // add service using the prepared config

                        if (options && options.makeTabs) {
                            //make menu for tabs
                            $(".main .tab").append(
                                '<button class="tablinks" id="tablinks-' + item.ID + '">' + item.ID + '</button>'
                            ).show();
                            $('#tablinks-' + item.ID).on("click", function(evt) {
                                self.openTab(evt, item.ID);
                            });
                            $(".serviceSection").css({
                                "border": "1px solid #ccc",
                                "border-top": "none"
                            });
                            if (self.options.defaultServiceID) {
                                $("#tablinks-" + self.options.defaultServiceID).click();
                            } else {
                                $(".tablinks")[0].click();
                            }
                        }
                    });
                } else {
                    // default -> list of all sotablestub scenarios
                    self.wsArray.push(new SOWebTable());
                }
            }
        });
    }

    setCountDown(seconds) {
        var timeleft = seconds;
        var downloadTimer = setInterval(function() {
            if (timeleft <= 0) {
                clearInterval(downloadTimer);
                location.reload();
            } else {
                document.getElementById("refreshIntervalCounter").innerHTML = timeleft;
            }
            timeleft -= 1;
        }, 1000);
    }

    openTab(evt, serviceName) {
        //console.log(evt, serviceName);
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("serviceSection");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(serviceName).style.display = "block";
        evt.currentTarget.className += " active";

        // update url
        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set("service", serviceName);
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
                window.history.pushState({ path: newurl }, '', newurl);
            }
        }
    }
}