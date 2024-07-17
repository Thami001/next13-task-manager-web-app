import React from 'react';
import {OrgControl} from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/orgControl";
import {auth} from "@clerk/nextjs/server";
import {startCase} from "lodash";

export async function generateMetadata() {
    const {orgSlug} = auth()

    return {
        title: startCase(orgSlug || "organization"),
    }

}

const OrganizationIdLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <>
            <OrgControl/>
            {children}
        </>
    );
};

export default OrganizationIdLayout;