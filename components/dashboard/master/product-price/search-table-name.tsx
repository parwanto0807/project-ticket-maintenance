"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";

type ProductNameOnly = {
    id: string;
    part_name: string;
};

export function SearchTableName({ productFind, onSelect }: { productFind: ProductNameOnly[], onSelect: (selected: ProductNameOnly | null) => void }) {
    const [open, setOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<ProductNameOnly | null>(null);

    const handleSelect = (product: ProductNameOnly) => {
        setSelectedProduct(product);
        onSelect(product); // Notify parent of the selected value
        setOpen(false); // Close drawer
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-1/2 justify-start">
                    {selectedProduct ? selectedProduct.part_name : "+ Set part name"}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList
                        productFind={productFind}
                        onSelect={handleSelect} // Pass handleSelect to StatusList
                        setOpen={setOpen}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function StatusList({
    productFind,
    setOpen,
    onSelect,
}: {
    productFind: ProductNameOnly[];
    setOpen: (open: boolean) => void;
    onSelect: (product: ProductNameOnly) => void;
}) {

    return (
        <Command>
            <CommandInput placeholder="Filter part name..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {productFind.map((product) => (
                        <CommandItem
                            key={product.id}
                            onClick={() => {
                                onSelect(product); // Notify parent of the selected value
                                setOpen(false); // Close drawer
                            }}
                        >
                            {product.part_name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
