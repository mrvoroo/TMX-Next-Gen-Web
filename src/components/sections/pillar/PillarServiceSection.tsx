import { Check, type LucideIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { PillarPageData, PillarServiceData } from '@/lib/content';
import { getServiceIcon } from '@/components/sections/services/icons';
import { ExampleFrame } from '@/components/examples/ExampleFrame';
import { ServiceExample } from '@/components/examples/ServiceExample';

function IconBadge({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 text-violet-400 ring-1 ring-violet-500/20">
      <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}

/**
 * One full section per visible service (server component). Blocks with no
 * content (intro, benefits, steps) are not rendered at all.
 */
export function PillarServiceSection({
  service,
  page,
  index,
}: {
  service: PillarServiceData;
  page: PillarPageData;
  index: number;
}) {
  const hasBenefits = service.benefits.length > 0;
  const hasSteps = service.steps.length > 0;
  const hasDetails = hasBenefits || hasSteps;

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-heading`}
      className={cn(
        'scroll-mt-24 border-t border-white/[0.05] py-16 sm:py-20 lg:py-24',
        index % 2 === 1 ? 'bg-[#070612]' : 'bg-[#050508]',
      )}
    >
      <div
        className={cn(
          'mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:gap-16',
          hasDetails && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]',
        )}
      >
        <div data-reveal className="min-w-0">
          <IconBadge Icon={getServiceIcon(service.icon)} />
          <h2
            id={`${service.slug}-heading`}
            className="text-2xl font-bold tracking-tight text-white [hyphens:auto] [overflow-wrap:anywhere] sm:text-3xl"
          >
            {service.name}
          </h2>
          {service.intro ? (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
              {service.intro}
            </p>
          ) : null}
          <Link
            href={{ pathname: '/kontakt', query: { service: service.slug } }}
            className="mt-8 inline-flex items-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]"
          >
            {page.ctaLabel}
          </Link>
        </div>

        {hasDetails ? (
          <div className="min-w-0 space-y-6">
            {hasBenefits ? (
              <div
                data-reveal
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
              >
                {page.benefitsHeading ? (
                  <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400/70">
                    {page.benefitsHeading}
                  </h3>
                ) : null}
                <ul className="space-y-3">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-white/75">
                      <Check
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-cyan-400"
                      />
                      <span className="min-w-0 [overflow-wrap:anywhere]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasSteps ? (
              <div
                data-reveal
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
              >
                {page.stepsHeading ? (
                  <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400/70">
                    {page.stepsHeading}
                  </h3>
                ) : null}
                <ol className="space-y-0">
                  {service.steps.map((step, i) => (
                    <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                      {i < service.steps.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-violet-500/40 to-cyan-500/10"
                        />
                      ) : null}
                      <span
                        aria-hidden="true"
                        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-[#0d0d14] text-xs font-semibold text-violet-300"
                      >
                        {i + 1}
                      </span>
                      <span className="min-w-0 pt-1 text-sm leading-relaxed text-white/75 [overflow-wrap:anywhere]">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {service.example !== 'none' ? (
        <div data-reveal className="mx-auto mt-12 max-w-7xl px-5 sm:mt-16 sm:px-8">
          <ExampleFrame label={page.exampleLabel} note={page.exampleNote}>
            <ServiceExample name={service.example} />
          </ExampleFrame>
        </div>
      ) : null}
    </section>
  );
}
