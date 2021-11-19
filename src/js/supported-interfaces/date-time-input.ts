import { DebotInterface } from "./debot-interface"
import { BinUtils } from "../../utils/bin-utils"

class DateTimeInputInterface extends DebotInterface {
  constructor(callbacks: any) {
    super(callbacks);
    this.setMethods({
      getDateTime: this.getDateTime.bind(this, true, true),
      getDate: this.getDateTime.bind(this, false, true),
      getTime: this.getDateTime.bind(this, true, false),
      getTimeZoneOffset: this.getTimeZoneOffset.bind(this)
    });
  }

  async getDateTime( needInputTime: boolean, needInputDate: boolean, body: any) {
    const bodyParams = body.value
    const { prompt } = body.value;

    const { defaultDate, defaultTime, defaultDatetime } = bodyParams;
    const defaultDatetimeValue = defaultDate || defaultTime || defaultDatetime || "0";
    const defaultDatetimeDate = new Date(parseInt(defaultDatetimeValue));

    const { minDate, minTime, minDatetime } = bodyParams;
    const defaultMinDatetimeValue = minDate || minTime || minDatetime || "0";
    const defaultMinDatetimeDate = new Date(parseInt(defaultMinDatetimeValue));

    const { maxDate, maxTime, maxDatetime } = bodyParams;
    const defaultMaxDatetimeValue = maxDate || maxTime || maxDatetime || "0";
    const defaultMaxDatetimeDate = new Date(parseInt(defaultMaxDatetimeValue));

    const { minuteInterval, inTimeZoneOffset } = bodyParams;


    return new Promise<any>((resolve) => {
      this.showMessage({
        type: "input-date-time",
        prompt: BinUtils.hexToString(prompt),
        needInputTime, needInputDate,
        minuteInterval, inTimeZoneOffset,
        defaultDatetime: defaultDatetimeDate,
        minDatetime: defaultMinDatetimeDate,
        maxDatetime: defaultMaxDatetimeDate,
        onInput: resolve
      });
    }).then(({ value }) => {
      this.showMessage({ type: "print", text: value.toString() }, "right");
      const timestamp = value; // / 1000 | 0;
      return { result: {
        datetime: timestamp,
        time: timestamp,
        date: timestamp,
        timeZoneOffset: new Date().getTimezoneOffset()
      }};
    });;
  }

  async getTimeZoneOffset(body: any) {
    return { result: { timeZoneOffset: new Date().getTimezoneOffset()}};
  }
}

export { DateTimeInputInterface }
