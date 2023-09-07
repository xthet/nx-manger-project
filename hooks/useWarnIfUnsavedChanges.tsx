import Router from "next/router"
import { useEffect, useState } from "react"

export const useWarnIfUnsavedChanges = (unsavedChanges: boolean) => {
  useEffect(() => {
    // For reloading.
    window.onbeforeunload = () => {
      if (unsavedChanges) {
        return "You have unsaved changes. Do you really want to leave?"
      }
    }

    // For changing in-app route.
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = confirm("You have unsaved changes. Do you really want to leave?")
        if (!ok) {
          Router.events.emit("routeChangeError")
          throw "Abort route change. Please ignore this error."
        }
      }

      Router.events.on("routeChangeStart", routeChangeStart)
      return () => {
        Router.events.off("routeChangeStart", routeChangeStart)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unsavedChanges])
}