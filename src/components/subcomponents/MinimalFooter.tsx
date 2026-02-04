import React, { PropsWithChildren } from 'react'
import clsx from 'clsx'

import { Stack, Text } from '@primer/react-brand'
import { BaseProps } from '@primer/react-brand/lib/component-helpers'

/**
 * Design tokens
 */
import '@primer/brand-primitives/lib/design-tokens/css/tokens/functional/components/footer/colors-with-modes.css'

/**
 * Main Stylesheet (as a CSS Module)
 */
import styles from '../css/MinimalFooter.module.css'

const socialLinkData = {
  x: {
    fullName: 'X',
    url: 'https://x.com/GithubCommSpain',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/x.svg',
    iconWidth: 20,
    iconHeight: 16,
  },
  meetup: {
    fullName: 'MeetUp',
    url: 'https://www.meetup.com/ghspain',
    icon: `${process.env.PUBLIC_URL}/images/logos/svg/Meetup.svg`,
    iconWidth: 20,
    iconHeight: 16,
  },
  github: {
    fullName: 'GitHub',
    url: 'https://github.com/ghspain',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg',
    iconWidth: 20,
    iconHeight: 20,
  },
  linkedin: {
    fullName: 'LinkedIn',
    url: 'https://www.linkedin.com/company/ghspain/',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/linkedin.svg',
    iconWidth: 19,
    iconHeight: 18,
  },
  youtube: {
    fullName: 'YouTube',
    url: 'https://www.youtube.com/@GitHubCommunitySpain/',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/youtube.svg',
    iconWidth: 23,
    iconHeight: 16,
  },
  facebook: {
    fullName: 'Facebook',
    url: 'https://www.facebook.com/GitHub',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/facebook.svg',
    iconWidth: 18,
    iconHeight: 18,
  },
  twitch: {
    fullName: 'Twitch',
    url: 'https://www.twitch.tv/github',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/twitch.svg',
    iconWidth: 18,
    iconHeight: 18,
  },
  tiktok: {
    fullName: 'TikTok',
    url: 'https://www.tiktok.com/@github',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/tiktok.svg',
    iconWidth: 18,
    iconHeight: 18,
  },
  instagram: {
    fullName: 'Instagram',
    url: 'https://www.instagram.com/github/',
    icon: 'https://github.githubassets.com/images/modules/site/icons/footer/instagram.svg',
    iconWidth: 24,
    iconHeight: 24,
  },
} as const

type SocialLinkName = keyof typeof socialLinkData
// type SocialLinkInfo = (typeof socialLinkData)[SocialLinkName] (not used)

const socialLinkNames = Object.keys(socialLinkData) as SocialLinkName[]

export type MinimalFooterProps = {
  /**
   * An array of social links to be displayed in the footer.
   */
  socialLinks?: SocialLinkName[] | false
  /**
   * The href for the GitHub logo.
   */
  logoHref?: string
  /**
   * The copyright statement to be displayed in the footer.
   * If not provided, the copyright statement will be the default GitHub copyright statement.
   */
  copyrightStatement?: string | React.ReactElement
} & BaseProps<HTMLElement>

function Root({
  className,
  children,
  copyrightStatement,
  logoHref = 'https://ghspain.es',
  socialLinks,
  ...rest
}: PropsWithChildren<MinimalFooterProps>) {
  // find Footer.Footnotes children
  const footerFootnoteChild = () => {
    const footnotes = React.Children.toArray(children).find(child => {
      if (!React.isValidElement(child)) return false
      return child.type === Footnotes
    })
    return footnotes
  }

  /**
   * Renders a maximum of 5 links.
   * If more than 5 links are required, we should encourage usage of Footer instead.
   */
  const LinkChildren = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.type === Link)
    .slice(0, 5)

  const currentYear = new Date().getFullYear()

  return (
    <footer className={clsx(styles.Footer, className)} {...rest}>
      {footerFootnoteChild()}
      <SocialLogomarks socialLinks={socialLinks} logoHref={logoHref} />
      <section>
        <div className={styles['Footer__legal-and-links']}>
          <div className={styles['Footer__container']}>
            <Stack
              direction={{ narrow: 'vertical', regular: 'horizontal' }}
              gap="normal"
              padding="none"
              justifyContent="space-between"
            >
              <Stack
                padding="none"
                gap="condensed"
                justifyContent={{
                  narrow: 'center',
                  regular: 'flex-end',
                }}
                direction={{
                  narrow: 'vertical',
                  regular: 'horizontal',
                }}
                className={styles['Footer__links']}
              >
                <>{LinkChildren}</>
              </Stack>
              <Text as="p" size="200" variant="muted" className={styles['Footer__copyright']}>
                {copyrightStatement ? copyrightStatement : (
                  <>
                    {`© ${currentYear} GitHub Community Spain. Todos los derechos reservados.`}
                  </>
                )}
              </Text>
            </Stack>
          </div>
        </div>
      </section>
    </footer>
  )
}



type FootnoteProps = BaseProps<HTMLElement>

function Footnotes({ children, className }: PropsWithChildren<FootnoteProps>) {
  const styledChildren = React.Children.map(children, child => {
    // if not valid element
    if (!React.isValidElement(child)) {
      return child
    }

    if (child.type && child.type === Text) {
      const textChild = child as React.ReactElement<any>
      return React.cloneElement(textChild, {
        ...textChild.props,
        as: 'p',
        variant: 'muted',
        size: '100',
        className: clsx(styles['Footer__terms-item'], textChild.props.className),
      })
    }

    return child
  })

  return (
    <section className={styles.Footer__container}>
      <div className={clsx(styles.Footer__terms, className)}>{styledChildren}</div>
    </section>
  )
}

type SocialLinkProps = { name: SocialLinkName }

const SocialLink = ({ name }: SocialLinkProps) => {
  const link = socialLinkData[name]
  return (
    <li key={name}>
      <a
        href={link.url}
        className={styles['Footer__social-link']}
        data-analytics-event={`{"category":"Footer","action":"go to ${link.fullName}","label":"text:${name}"}`}
      >
        <img
          className={styles['Footer__social-icon']}
          src={link.icon}
          height={link.iconHeight}
          width={link.iconWidth}
          loading="lazy"
          decoding="async"
          alt=""
        />
        <span className="visually-hidden">GitHub on {link.fullName}</span>
      </a>
    </li>
  )
}

type SocialLogomarksProps = {
  socialLinks?: SocialLinkName[] | false
  logoHref?: string
}

function SocialLogomarks({ socialLinks = socialLinkNames, logoHref }: SocialLogomarksProps) {

  return (
    <section className={clsx(styles['Footer__logomarks'])}>
      <div className={styles['Footer__container']}>
        <Stack
          alignItems="center"
          direction={{ narrow: 'vertical', regular: 'horizontal' }}
          gap="normal"
          padding="none"
          justifyContent="space-between"
        >
          <div>
            <a
              href={logoHref}
              data-analytics-event='{"category":"Footer","action":"go to home","label":"text:home"}'
              aria-label="GitHub"
            >
              <div
                className={styles['Footer__logo']}
                role="img"
                aria-label="GitHub Community Spain"
              />
            </a>
          </div>
          {socialLinks ? (
            <ul className={styles['Footer__social-links']}>
              {socialLinks.map(name => (
                <SocialLink key={name} name={name} />
              ))}
            </ul>
          ) : null}
        </Stack>
      </div>
    </section>
  )
}

type LinkProps<C extends React.ElementType> = BaseProps<C> &
{ as?: C } &
  Omit<React.ComponentPropsWithoutRef<C>, keyof BaseProps<C> | 'as'>

const Link = <C extends React.ElementType = 'a'>({ as, children, ...rest }: PropsWithChildren<LinkProps<C>>) => {
  const Component = as || 'a'
  return (
    <Component
      className={styles['Footer__link']}
      data-analytics-event={
        'href' in rest && rest.href ? `{"category":"Footer","action":"go to ${rest.href}","label":"text:${children}"}` : undefined
      }
      {...rest}
    >
      <Text variant="muted" size="200">
        {children}
      </Text>
    </Component>
  )
}

/**
 * Use MinimalFooter to render a global footer on all GitHub pages.
 * @see https://primer.style/brand/components/MinimalFooter
 */
export const MinimalFooter = Object.assign(Root, {
  Footnotes,
  Link,
})