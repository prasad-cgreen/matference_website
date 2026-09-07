/**
 * The five list-shaped website sections, each a configured ItemsEditor.
 *
 * Keeping the wording here rather than in the router means every section's
 * copy - what it is called, what it does, what to do when it is empty - sits
 * in one place next to the group name the API expects.
 */
import React from "react";
import ItemsEditor from "@/admin/ItemsEditor";

export function ManagingTeamSection() {
  return (
    <ItemsEditor
      group="team"
      kind="people"
      title="Managing Team"
      description="The first row of cards under “Our Team” on the home page."
      addLabel="Add member"
      emptyHint="Add the leadership team here. Each entry becomes a card with a portrait, role, short bio and LinkedIn link."
    />
  );
}

export function NomineeDirectorsSection() {
  return (
    <ItemsEditor
      group="nominee_directors"
      kind="people"
      title="Nominee Directors on Board"
      description="Shown under “Nominee Directors On Board” on the home page."
      addLabel="Add director"
      emptyHint="Add the directors nominated to the board. The heading stays on the website even while this is empty."
    />
  );
}

export function AdvisorsSection() {
  return (
    <ItemsEditor
      group="advisors"
      kind="people"
      title="Advisors to the Board"
      description="Shown under “Advisors To The Board” on the home page."
      addLabel="Add advisor"
      emptyHint="This section currently shows a “Coming Soon” card on the website. Adding the first advisor here replaces it."
    />
  );
}

export function PartnersSection() {
  return (
    <ItemsEditor
      group="partners"
      kind="logos"
      title="Partners in Impact"
      description="The partner logos on the home page."
      addLabel="Add partner"
      emptyHint="Add each partner as an entry, then upload its logo. The name is used as the image's alt text for screen readers."
    />
  );
}

export function LendersSection() {
  return (
    <ItemsEditor
      group="lenders"
      kind="logos"
      title="Trusted by Lenders"
      description="The scrolling lender logos near the bottom of the home page."
      addLabel="Add lender"
      emptyHint="Add each lender as an entry, then upload its logo. Logos scroll continuously, so the order sets where each one appears in the loop."
    />
  );
}
