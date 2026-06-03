import { AccountTable } from "@/components/account-table"
import { HomeCarousel } from "@/components/home-carousel"
import { QqGroupButton } from "@/components/qq-group-button"
import { getValuationList } from "@/lib/valuation"

export default function Page() {
  const items = getValuationList()

  return (
    <div className="flex min-h-svh flex-col px-4 pb-4">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-5">
        <HomeCarousel />

        <section>
          <AccountTable items={items} />
        </section>
      </div>

      <QqGroupButton />
    </div>
  )
}
