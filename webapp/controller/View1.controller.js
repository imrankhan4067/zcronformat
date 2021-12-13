sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("datetimeexp.DateTimeExperimental.controller.View1", {
		onInit: function () {},
		updateTextField: function () {
			var startDate = this.byId("dateTimePicker1").getDateValue();
			var endDate = this.byId("dateTimePicker2").getDateValue();
			var period = this.byId("inpPeriod").getValue();
			var dailyOrWeekly = this.byId("selDayorWeek").getSelectedKey();
			var cronObj = this.translateCron(startDate, endDate, period, dailyOrWeekly);
			var cronText = "";
			for (var i = 0; i < cronObj.length; i++)
				cronText += ([cronObj[i].YEAR, cronObj[i].MONTH, cronObj[i].DAY, cronObj[i].DAYOFWEEK, cronObj[i].HOUR, cronObj[i].MINUTE, cronObj[
					i].SECOND]).join(
					" ") + "\n";
			this.byId("textField").setText(cronText);
		},
		translateCron: function (startDateTime, endDateTime, period, dailyOrWeekly) {
			var cronFields = [];

			var startYear = startDateTime.getFullYear();
			var endYear = endDateTime.getFullYear();
			// to convert 0 indexed to 1 indexed
			var startMonth = startDateTime.getMonth() + 1;
			var endMonth = endDateTime.getMonth() + 1;

			var startDay = startDateTime.getDate();
			var endDay = endDateTime.getDate();

			var startHour = startDateTime.getHours();
			var endHour = endDateTime.getHours();

			var startMinute = startDateTime.getMinutes();
			var endMinute = endDateTime.getMinutes();

			var startSecond = startDateTime.getSeconds();
			var endSecond = endDateTime.getSeconds();

			var idx;
			if (dailyOrWeekly === "Hourly") {
				if (startYear === endYear && startMonth === endMonth && startDay === endDay) {
					idx = 0;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = startDay.toString();

					if (startHour === endHour) {
						cronFields[idx].HOUR = startHour.toString();
					} else {
						if (startMinute < endMinute) {
							cronFields[idx].HOUR = startHour.toString() + ":" + endHour.toString();
						} else {
							if (startMinute === endMinute && startSecond <= endSecond) {
								cronFields[idx].HOUR = startHour.toString() + ":" + endHour.toString();
							} else {
								cronFields[idx].HOUR = startHour.toString() + ":" + (endHour - 1).toString();
							}
						}
					}
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();
				} else if (startYear === endYear && startMonth === endMonth) {
					//enter the first day
					idx = 0;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = startDay.toString();
					cronFields[idx].HOUR = startHour.toString() + ":-1";
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();
					if (endDay - startDay > 1) {
						// enter multiple days between the begin and end
						idx++;
						cronFields.push({
							YEAR: "*",
							MONTH: "*",
							DAY: "*",
							DAYOFWEEK: "*",
							HOUR: "*",
							MINUTE: "*",
							SECOND: "*"
						});
						cronFields[idx].YEAR = startYear.toString();
						cronFields[idx].MONTH = startMonth.toString();
						if (endDay - 1 === startDay + 1) {
							cronFields[idx].DAY = (startDay + 1).toString();
						} else {
							cronFields[idx].DAY = (startDay + 1).toString() + ":" + (endDay - 1).toString();
						}
						if (period > 1) {
							cronFields[idx].HOUR += "/" + period;
						}
						cronFields[idx].MINUTE = startMinute.toString();
						cronFields[idx].SECOND = startSecond.toString();
					}
					//enter the end day
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = endDay.toString();

					if (startMinute === endMinute && startSecond <= endSecond) {
						cronFields[idx].HOUR = "0:" + endHour.toString();
					} else {
						cronFields[idx].HOUR = "0:" + (endHour - 1).toString();

					}
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

				} else if (startYear === endYear) {
					// first day of the month
					idx = 0;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = startDay.toString();
					cronFields[idx].HOUR = startHour.toString() + ":-1";
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					// rest of the days of the month
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = (startDay + 1).toString() + ":-1";
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					//middle months
					if (endMonth - startMonth > 1) {
						idx++;
						cronFields.push({
							YEAR: "*",
							MONTH: "*",
							DAY: "*",
							DAYOFWEEK: "*",
							HOUR: "*",
							MINUTE: "*",
							SECOND: "*"
						});
						cronFields[idx].YEAR = startYear.toString();
						if (startMonth + 1 === endMonth - 1) {
							cronFields[idx].MONTH = (startMonth + 1).toString();
						} else {
							cronFields[idx].MONTH = (startMonth + 1).toString() + ":" + (endMonth - 1).toString();
						}
						if (period > 1) {
							cronFields[idx].HOUR += "/" + period;
						}
						cronFields[idx].MINUTE = startMinute.toString();
						cronFields[idx].SECOND = startSecond.toString();
					}

					//end month
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = endMonth.toString();
					cronFields[idx].DAY = "0:" + endDay.toString();

					if (startMinute === endMinute && startSecond <= endSecond) {
						cronFields[idx].HOUR = "0:" + endHour.toString();
					} else {
						cronFields[idx].HOUR = "0:" + (endHour - 1).toString();
					}

					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();
				} else {
					//first day
					idx = 0;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = startDay.toString();
					cronFields[idx].HOUR = startHour.toString() + ":-1";
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					// rest of the days of the month
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = (startDay + 1).toString() + ":-1";
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					// rest of the months of the year
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = (startMonth + 1).toString() + ":-1";

					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					//middle years
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					if (startYear + 1 === endYear - 1) {
						cronFields[idx].YEAR = (startYear + 1).toString();
					} else {
						cronFields[idx].YEAR = (startYear + 1).toString() + ":" + (endYear - 1).toString();
					}
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					// last year
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = endYear.toString();
					cronFields[idx].MONTH = "1:" + endMonth.toString();
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					//last month
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = endYear.toString();
					cronFields[idx].MONTH = endMonth.toString();
					cronFields[idx].DAY = "0:" + (endDay - 1).toString();
					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

					//last day
					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = endYear.toString();
					cronFields[idx].MONTH = endMonth.toString();
					cronFields[idx].DAY = endDay.toString();
					if (startMinute === endMinute && startSecond <= endSecond) {
						cronFields[idx].HOUR = "0:" + endHour.toString();
					} else {
						cronFields[idx].HOUR = "0:" + (endHour - 1).toString();
					}

					if (period > 1) {
						cronFields[idx].HOUR += "/" + period;
					}
					cronFields[idx].MINUTE = startMinute.toString();
					cronFields[idx].SECOND = startSecond.toString();

				}
			} else {
				if (startYear === endYear) {
					idx = 0;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = startYear.toString();
					if (startMonth === endMonth) {
						cronFields[idx].MONTH = startMonth.toString();
						if (startDay === endDay) {
							//1. same year, month and date
							cronFields[idx].DAY = startDay.toString();
							if (dailyOrWeekly === "Hourly") {
								if (startHour !== endHour) {
									cronFields[idx].HOUR = startHour.toString() + ":" + endHour.toString();
								}
								if (period > 1) {
									cronFields[idx].HOUR += "/" + parseInt(period, 10);
								}
							}
						} else {
							//2. same year, same month, different date
							cronFields[idx].DAY = this.handleDateOnTime(startDateTime, endDateTime).DAY;
						}

						cronFields[0].HOUR = startDateTime.getHours();
						cronFields[0].MINUTE = startDateTime.getMinutes();
						cronFields[0].SECOND = startDateTime.getSeconds();
						if (period > 1 && dailyOrWeekly === "Daily") {
							cronFields[0].DAY += "/" + parseInt(period, 10);
						}
						if (period > 1 && dailyOrWeekly === "Weekly") {
							cronFields[0].DAY += "/" + parseInt(period * 7, 10);
						}
						if (dailyOrWeekly == "Monthly") {
							cronFields[0].DAY = startDay.toString();
							if (period > 1) {
								cronFields[0].MONTH += "/" + parseInt(period, 10);
							}
						}

					} else {
						//handling for seperate months
						var idx = 0;
						cronFields[idx].MONTH = startMonth.toString();
						cronFields[idx].DAY = startDay.toString() + ":-1";
						cronFields[idx].HOUR = startDateTime.getHours();
						cronFields[idx].MINUTE = startDateTime.getMinutes();
						cronFields[idx].SECOND = startDateTime.getSeconds();
						if (period > 1 && dailyOrWeekly === "Daily") {
							cronFields[idx].DAY += "/" + parseInt(period, 10);
						}
						if (period > 1 && dailyOrWeekly === "Weekly") {
							cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
						}
						if (dailyOrWeekly == "Monthly") {
							cronFields[idx].DAY = startDay.toString();
							if (period > 1) {
								cronFields[idx].MONTH += "/" + parseInt(period, 10);
							}
						}
						if (endMonth - startMonth > 1) {
							// if there is more than one month in between the start and end months
							idx++;
							cronFields.push({
								YEAR: "*",
								MONTH: "*",
								DAY: "*",
								DAYOFWEEK: "*",
								HOUR: "*",
								MINUTE: "*",
								SECOND: "*"
							});
							cronFields[idx].YEAR = startYear;
							if (startMonth + 1 === endMonth - 1) {
								cronFields[idx].MONTH = startMonth + 1;
							} else {
								cronFields[idx].MONTH = (startMonth + 1).toString() + ":" + (endMonth - 1).toString();
							}

							cronFields[idx].HOUR = startDateTime.getHours();
							cronFields[idx].MINUTE = startDateTime.getMinutes();
							cronFields[idx].SECOND = startDateTime.getSeconds();
							if (period > 1 && dailyOrWeekly === "Daily") {
								cronFields[idx].DAY += "/" + parseInt(period, 10);
							}
							if (period > 1 && dailyOrWeekly === "Weekly") {
								cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
							}
							if (dailyOrWeekly == "Monthly") {
								cronFields[idx].DAY = startDay.toString();
								if (period > 1) {
									cronFields[idx].MONTH += "/" + parseInt(period, 10);
								}
							}

						}
						idx++;
						cronFields.push({
							YEAR: "*",
							MONTH: "*",
							DAY: "*",
							DAYOFWEEK: "*",
							HOUR: "*",
							MINUTE: "*",
							SECOND: "*"
						});
						cronFields[idx].YEAR = startYear;
						cronFields[idx].MONTH = endMonth;
						var dateField = this.handleDateOnTime(new Date(endYear, endMonth, 1, startHour, startMinute, startSecond), endDateTime);
						cronFields[idx].DAY = dateField.DAY;
						cronFields[idx].HOUR = startDateTime.getHours();
						cronFields[idx].MINUTE = startDateTime.getMinutes();
						cronFields[idx].SECOND = startDateTime.getSeconds();
						if (period > 1 && dailyOrWeekly === "Daily") {
							cronFields[idx].DAY += "/" + parseInt(period, 10);
						}
						if (period > 1 && dailyOrWeekly === "Weekly") {
							cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
						}
						if (dailyOrWeekly == "Monthly") {
							cronFields[idx].DAY = startDay.toString();
							if (period > 1) {
								cronFields[idx].MONTH += "/" + parseInt(period, 10);
							}
						}
					}

				} else {
					//handling for seperate years
					idx = 0;
					cronFields.push({
							YEAR: "*",
							MONTH: "*",
							DAY: "*",
							DAYOFWEEK: "*",
							HOUR: "*",
							MINUTE: "*",
							SECOND: "*"
						});
					cronFields[idx].YEAR = startYear.toString();
					cronFields[idx].MONTH = startMonth.toString();
					cronFields[idx].DAY = startDay.toString() + ":-1";
					cronFields[idx].HOUR = startDateTime.getHours();
					cronFields[idx].MINUTE = startDateTime.getMinutes();
					cronFields[idx].SECOND = startDateTime.getSeconds();

					if (period > 1 && dailyOrWeekly === "Daily") {
						cronFields[idx].DAY += "/" + parseInt(period, 10);
					}
					if (period > 1 && dailyOrWeekly === "Weekly") {
						cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
					}
					if (dailyOrWeekly == "Monthly") {
						cronFields[idx].DAY = startDay.toString();
						if (period > 1) {
							cronFields[idx].MONTH += "/" + parseInt(period, 10);
						}
					}
					if (startMonth !== 12) {
						idx++;
						cronFields.push({
							YEAR: "*",
							MONTH: "*",
							DAY: "*",
							DAYOFWEEK: "*",
							HOUR: "*",
							MINUTE: "*",
							SECOND: "*"
						});
						cronFields[idx].YEAR = startYear.toString();
						cronFields[idx].MONTH = (startMonth + 1).toString() + ":-1";
						cronFields[idx].HOUR = startDateTime.getHours();
						cronFields[idx].MINUTE = startDateTime.getMinutes();
						cronFields[idx].SECOND = startDateTime.getSeconds();

						if (period > 1 && dailyOrWeekly === "Daily") {
							cronFields[idx].DAY += "/" + parseInt(period, 10);
						}
						if (period > 1 && dailyOrWeekly === "Weekly") {
							cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
						}
						if (dailyOrWeekly == "Monthly") {
							cronFields[idx].DAY = startDay.toString();
							if (period > 1) {
								cronFields[idx].MONTH += "/" + parseInt(period, 10);
							}
						}

					}
					if (endYear - startYear > 1) {
						idx++;
						cronFields.push({
							YEAR: "*",
							MONTH: "*",
							DAY: "*",
							DAYOFWEEK: "*",
							HOUR: "*",
							MINUTE: "*",
							SECOND: "*"
						});
						if (endYear - 1 === startYear + 1) {
							cronFields[idx].YEAR = (startYear + 1).toString();
						} else {
							cronFields[idx].YEAR = (startYear + 1).toString() + ":" + (endYear - 1).toString();
						}
						cronFields[idx].HOUR = startDateTime.getHours();
						cronFields[idx].MINUTE = startDateTime.getMinutes();
						cronFields[idx].SECOND = startDateTime.getSeconds();

						if (period > 1 && dailyOrWeekly === "Daily") {
							cronFields[idx].DAY += "/" + parseInt(period, 10);
						}
						if (period > 1 && dailyOrWeekly === "Weekly") {
							cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
						}
						if (dailyOrWeekly == "Monthly") {
							cronFields[idx].DAY = startDay.toString();
							if (period > 1) {
								cronFields[idx].MONTH += "/" + parseInt(period, 10);
							}
						}
					}
					if (endMonth !== 1) {
						idx++;
						cronFields.push({
							YEAR: "*",
							MONTH: "*",
							DAY: "*",
							DAYOFWEEK: "*",
							HOUR: "*",
							MINUTE: "*",
							SECOND: "*"
						});
						cronFields[idx].YEAR = endYear.toString();
						if (endMonth > 2) {
							cronFields[idx].MONTH = "1:" + endMonth;
						} else {
							cronFields[idx].MONTH = "1";
						}
						cronFields[idx].HOUR = startDateTime.getHours();
						cronFields[idx].MINUTE = startDateTime.getMinutes();
						cronFields[idx].SECOND = startDateTime.getSeconds();

						if (period > 1 && dailyOrWeekly === "Daily") {
							cronFields[idx].DAY += "/" + parseInt(period, 10);
						}
						if (period > 1 && dailyOrWeekly === "Weekly") {
							cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
						}
						if (dailyOrWeekly == "Monthly") {
							cronFields[idx].DAY = startDay.toString();
							if (period > 1) {
								cronFields[idx].MONTH += "/" + parseInt(period, 10);
							}
						}
					}

					idx++;
					cronFields.push({
						YEAR: "*",
						MONTH: "*",
						DAY: "*",
						DAYOFWEEK: "*",
						HOUR: "*",
						MINUTE: "*",
						SECOND: "*"
					});
					cronFields[idx].YEAR = endYear.toString();
					cronFields[idx].MONTH = endMonth.toString();
					var dateField = this.handleDateOnTime(new Date(endYear, endMonth, 1, startHour, startMinute, startSecond), endDateTime);
					cronFields[idx].DAY = dateField.DAY;
					cronFields[idx].HOUR = startDateTime.getHours();
					cronFields[idx].MINUTE = startDateTime.getMinutes();
					cronFields[idx].SECOND = startDateTime.getSeconds();
					if (period > 1 && dailyOrWeekly === "Daily") {
						cronFields[idx].DAY += "/" + parseInt(period, 10);
					}
					if (period > 1 && dailyOrWeekly === "Weekly") {
						cronFields[idx].DAY += "/" + parseInt(period * 7, 10);
					}
					if (dailyOrWeekly == "Monthly") {
						cronFields[idx].DAY = startDay.toString();
						if (period > 1) {
							cronFields[idx].MONTH += "/" + parseInt(period, 10);
						}
					}
				}
			}

			return cronFields;
		},
		handleDateOnTime: function (startDateTime, endDateTime) {
			var cronDayEntry = {
				DAY: "*",
				DAYOFWEEK: "*",
				HOUR: "*",
				MINUTE: "*",
				SECOND: "*"
			};
			var startDay = startDateTime.getDate();
			var endDay = endDateTime.getDate();

			var startHour = startDateTime.getHours();
			var endHour = endDateTime.getHours();

			var startMinute = startDateTime.getMinutes();
			var endMinute = endDateTime.getMinutes();

			var startSecond = startDateTime.getSeconds();
			var endSecond = endDateTime.getSeconds();
			if (startHour < endHour) {
				cronDayEntry.DAY = startDay.toString() + ":" + endDay.toString();
			} else if (startHour > endHour) {
				cronDayEntry.DAY = startDay.toString() + ":" + (endDay - 1).toString();
			} else {
				if (startMinute < endMinute) {
					cronDayEntry.DAY = startDay.toString() + ":" + endDay.toString();
				} else if (startMinute > endMinute) {
					cronDayEntry.DAY = startDay.toString() + ":" + (endDay - 1).toString();
				} else {
					if (startSecond <= endSecond) {
						cronDayEntry.DAY = startDay.toString() + ":" + endDay.toString();
					} else {
						cronDayEntry.DAY = startDay.toString() + ":" + (endDay - 1).toString();
					}
				}
			}

			return cronDayEntry;
		}
	});
});