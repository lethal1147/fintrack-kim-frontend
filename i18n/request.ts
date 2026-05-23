import { getRequestConfig } from "next-intl/server"
import enMessages from "@/messages/en.json"

// Server-side i18n config for next-intl.
// The actual locale is managed client-side via the preferences store and
// LocaleProvider (NextIntlClientProvider). This config provides the default
// English messages as a fallback so that server/static rendering does not
// throw ENVIRONMENT_FALLBACK errors.
export default getRequestConfig(async () => {
  return {
    locale: "en",
    messages: enMessages,
  }
})
