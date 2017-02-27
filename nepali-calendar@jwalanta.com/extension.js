/* 
 * Nepali Date Indicator
 *
 * gnome-shell extension to show current Nepali date
 *
 * Date calculation based on:
 *    https://github.com/foss-np/NepaliCalendar
 *
 * Author: Jwalanta Shrestha <jwalanta at gmail dot com>
 *
 */

const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;


var nepDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
var nepMonths = ["","बैशाख","ज्येष्ठ","आषाढ","श्रावण","भाद्र","आश्विन","कार्तिक","मंसिर","पौष","माघ","फाल्गुन","चैत्र"];

var digitToNepali = function(n){
  var nstr = n.toString()
  var str = ""

  for (i=0; i < nstr.length; i++){
    str += nepDigits[parseInt(nstr[i])]
  }

  return str
}

var engtonep = {

    // initialization of variable
    eng_start_date: 14,
    eng_start_month: 4,
    eng_start_year: 1943,
    start_year: 0,
    start_month: 0,
    start_date: 0,
    nep_start_date: 1,
    nep_start_month: 1,
    nep_start_year: 2000,
    day_of_week: 4,
    end_day_of_month: 0,

    nepMap: {
      2000: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2001: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2002: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2003: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2004: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2005: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2006: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2007: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2008: [0, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
      2009: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2010: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2011: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2012: [0, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
      2013: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2014: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2015: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2016: [0, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
      2017: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2018: [0, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2019: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2020: [0, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
      2021: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2022: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
      2023: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2024: [0, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
      2025: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2026: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2027: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2028: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2029: [0, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
      2030: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2031: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2032: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2033: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2034: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2035: [0, 30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
      2036: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2037: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2038: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2039: [0, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
      2040: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2041: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2042: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2043: [0, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
      2044: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2045: [0, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2046: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2047: [0, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
      2048: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2049: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
      2050: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2051: [0, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
      2052: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2053: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
      2054: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2055: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2056: [0, 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
      2057: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2058: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2059: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2060: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2061: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2062: [0, 30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
      2063: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2064: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2065: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2066: [0, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
      2067: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2068: [0, 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2069: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2070: [0, 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
      2071: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2072: [0, 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
      2073: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
      2074: [0, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
      2075: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2076: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
      2077: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
      2078: [0, 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
      2079: [0, 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
      2080: [0, 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
      2081: [0, 31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
      2082: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
      2083: [0, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
      2084: [0, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
      2085: [0, 31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
      2086: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
      2087: [0, 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
      2088: [0, 30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
      2089: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
      2090: [0, 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    },

    DateConversion: function(year, month, date) {

        this.start_month = this.nep_start_month;
        this.start_year = this.nep_start_year;
        this.start_date = this.nep_start_date;
        var new_days = 0;

        var days = 1000 * 60 * 60 * 24;

        var foo_date1 = new Date(year, month - 1, date, 0, 0, 0);
        var foo_date2 = new Date(this.eng_start_year, this.eng_start_month - 1, this.eng_start_date)

        var new_days = Math.round((foo_date1 - foo_date2) / days);

        while (new_days != 0) {

            this.end_day_of_month = this.nepMap[this.start_year][this.start_month];

            this.day_of_week++;
            this.start_date++;

            if (this.start_date > this.end_day_of_month) {
                this.start_month++;

                this.start_date = 1;

                if (this.start_month > 12) {
                    this.start_year++;
                    this.start_month = 1;
                }
            }

            if (this.day_of_week > 7) {
                this.day_of_week = 1;
            }
            new_days--; // after each loop, reduce day
        }

        return this;

    },

    getYear: function() {
        return this.start_year;
    },

    getMonth: function() {
        return this.start_month;
    },

    getDate: function() {
        return this.start_date;
    },

    getDay: function() {
        return this.day_of_week;
    },

    getTotalDays: function() {
        return this.end_day_of_month;
    },

};


const NepaliCalendarIndicator = new Lang.Class({
    Name: 'NepaliCalendarIndicator',
    Extends: PanelMenu.Button,


    _init: function () {
      this.parent(0.0, "Nepali Calendar Indicator", false);
      this.buttonText = new St.Label({
        text: _("Loading..."),
        y_align: Clutter.ActorAlign.CENTER
      });
      this.actor.add_actor(this.buttonText);
      this._refresh();
    },


    _refresh: function () {
      this._refreshDate()
      this._removeTimeout();
      this._timeout = Mainloop.timeout_add_seconds(1, Lang.bind(this, this._refresh));
      return true;
    },


    _refreshDate: function (data) {

      var now = new Date()
      var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      var now_npt = new Date();
      now_npt.setTime(now_utc.getTime() + (5*60+45)*60*1000)

      var nepDate = engtonep.DateConversion(now_npt.getFullYear(), now_npt.getMonth() + 1, now_npt.getDate())
      let txt = digitToNepali(nepDate.getYear()) + "/" + nepMonths[nepDate.getMonth()] + "/" + digitToNepali(nepDate.getDate());
       global.log(txt)
      this.buttonText.set_text(txt);
    },


    _removeTimeout: function () {
      if (this._timeout) {
        Mainloop.source_remove(this._timeout);
        this._timeout = null;
      }
    },


    stop: function () {
      if (this._timeout)
        Mainloop.source_remove(this._timeout);


      this._timeout = undefined;


      this.menu.removeAll();
    }
  }
);


let nepcal;


function init() {
}


function enable() {
  nepcal = new NepaliCalendarIndicator;
  Main.panel.addToStatusArea('nepcal-indicator', nepcal);
}


function disable() {
  nepcal.stop();
  nepcal.destroy();
}
