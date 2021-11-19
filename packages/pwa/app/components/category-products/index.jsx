/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {useIntl} from 'react-intl'
import {Button} from '@chakra-ui/react'
import ProductScroller from '../../components/product-scroller'
import useWishlist from '../../hooks/use-wishlist'
import {useToast} from '../../hooks/use-toast'
import useNavigation from '../../hooks/use-navigation'
import {API_ERROR_MESSAGE} from '../../constants'
import useCategoryProducts from '../../commerce-api/hooks/useCategoryProducts'

/**
 * A component for fetching and rendering products from a specific Category.
 */
const CategoryProducts = ({categoryId, limit, ...props}) => {
    const {loading, products, getCategoryProducts} = useCategoryProducts()

    const wishlist = useWishlist()
    const toast = useToast()
    const navigate = useNavigation()
    const {formatMessage} = useIntl()

    const ref = useRef()

    useEffect(() => {
        getCategoryProducts(categoryId, limit)
    }, [])

    // TODO: DRY the wishlist handlers when intl
    // provider is available globally
    const addItemToWishlist = async (product) => {
        try {
            await wishlist.createListItem({
                id: product.productId,
                quantity: 1
            })
            toast({
                title: formatMessage(
                    {
                        defaultMessage:
                            '{quantity} {quantity, plural, one {item} other {items}} added to wishlist'
                    },
                    {quantity: 1}
                ),
                status: 'success',
                action: (
                    // it would be better if we could use <Button as={Link}>
                    // but unfortunately the Link component is not compatible
                    // with Chakra Toast, since the ToastManager is rendered via portal
                    // and the toast doesn't have access to intl provider, which is a
                    // requirement of the Link component.
                    <Button variant="link" onClick={() => navigate('/account/wishlist')}>
                        View
                    </Button>
                )
            })
        } catch {
            toast({
                title: formatMessage(
                    {defaultMessage: '{errorMessage}'},
                    {errorMessage: API_ERROR_MESSAGE}
                ),
                status: 'error'
            })
        }
    }
    const removeItemFromWishlist = async (product) => {
        try {
            await wishlist.removeListItemByProductId(product.productId)
            toast({
                title: formatMessage({defaultMessage: 'Item removed from wishlist'}),
                status: 'success',
                id: product.productId
            })
        } catch {
            toast({
                title: formatMessage(
                    {defaultMessage: '{errorMessage}'},
                    {errorMessage: API_ERROR_MESSAGE}
                ),
                status: 'error'
            })
        }
    }

    return (
        <ProductScroller
            ref={ref}
            products={products?.hits}
            isLoading={loading}
            productTileProps={(product) => ({
                enableFavourite: true,
                isFavourite: !!wishlist.findItemByProductId(product?.productId),
                onFavouriteToggle: (isFavourite) => {
                    const action = isFavourite ? addItemToWishlist : removeItemFromWishlist
                    return action(product)
                }
            })}
            {...props}
        />
    )
}

CategoryProducts.propTypes = {
    /* The category ID from which fetch products */
    categoryId: PropTypes.string,

    /* The number of products to fetch from a category */
    limit: PropTypes.number
}

export default CategoryProducts
