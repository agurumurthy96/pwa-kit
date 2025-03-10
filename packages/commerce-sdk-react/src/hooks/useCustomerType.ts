/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import useAuthContext from './useAuthContext'

export type CustomerType = null | 'guest' | 'registered'
type useCustomerType = {
    customerType: CustomerType
    isGuest: boolean
    isRegistered: boolean
}

/**
 * A hook to return customer auth type.
 *
 * Customer type can have 3 values:
 * - null
 * - guest
 * - registered
 *
 * During initialization, type is null. And it is possible that
 * isGuest and isRegistered to both be false.
 *
 */
const useCustomerType = (): useCustomerType => {
    const auth = useAuthContext()
    let customerType: string | null = auth.get('customer_type')

    const isGuest = customerType === 'guest'
    const isRegistered = customerType === 'registered'

    if (customerType !== null && customerType !== 'guest' && customerType !== 'registered') {
        customerType = null
    }

    return {
        customerType,
        isGuest,
        isRegistered
    }
}

export default useCustomerType
