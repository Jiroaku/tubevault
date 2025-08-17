import { A } from '@solidjs/router'
import { JSX } from 'solid-js'
import '../styles/tubevault.css'

// Layout Component that provides the persistent header
function Layout(props: { children: JSX.Element }) {
  return (
    <div id="page">
      {/* Header */}
      <div id="masthead-container">
        <div id="masthead" style="padding: 0.69em 0 0.7em; box-sizing: border-box; max-width: 1200px; margin: 0 auto; padding-left: 20px; padding-right: 20px;">
          <div style="float: left; display: flex; align-items: center; margin-left: 7px;">
            <div style="margin-left: 0px; display: flex; align-items: center;">
              <A href="/" style="margin-right: 8px; text-decoration: none; display: flex; align-items: center;">
                <img src="/tubevault.png" alt="TubeVault" style="height: 32px; width: auto;" />
              </A>
              <span style="font-size: 11px; color: #999; font-family: Arial, Helvetica, sans-serif; margin-right: 1px; margin-left: 4px; margin-top: 2px;">
                Preserving YouTube's early history
              </span>
            </div>
          </div>
          <div id="masthead-utility" style="margin-right: 7px;">
            <A href="/users" class="start">Oldest Users</A>
            <A href="/videos">Oldest Videos</A>
            <A href="/t/overview">Documentation</A>
            <A href="/t/about" class="end">About</A>
          </div>
          <div class="clear"></div>
        </div>
      </div>

      {/* This is where the route content will be rendered */}
      {props.children}

      {/* Footer Notice */}
      <footer class="footer-notice">
        <p class="disclaimer-text">
          This site is not affiliated with Google, YouTube, or any of their subsidiaries. 
          TubeVault is an independent preservation project.
        </p>
      </footer>
    </div>
  )
}

export default Layout