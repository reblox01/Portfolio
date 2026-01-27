import NotificationsForm from "./notifications-form"
import { getNotificationSettingsAction, getSmtpStatusAction } from "@/actions/notification.actions"

export default async function NotificationsPage() {
    const [settings, smtpStatus] = await Promise.all([
        getNotificationSettingsAction(),
        getSmtpStatusAction()
    ])

    return <NotificationsForm initialSettings={settings} smtpStatus={smtpStatus} />
}
