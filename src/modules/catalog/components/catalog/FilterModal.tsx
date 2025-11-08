import { Fragment } from 'react';
import { Dialog, DialogPanel,Transition, TransitionChild } from '@headlessui/react';
import { type ProductFilters } from '../../types';
import { FilterMobile } from './FilterMobile';
import { FilterMobileSkeleton } from '../skeletons';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: unknown) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  loading?: boolean;
  priceErrors?: {
    priceMin?: string;
    priceMax?: string;
  };
  onPriceChange?: (key: 'priceMin' | 'priceMax', value: number | undefined) => void;
}

export const FilterModal = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  loading = false,
  priceErrors,
  onPriceChange
}: FilterModalProps) => {
  const handleApplyFilters = () => {
    onApplyFilters();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }} />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden text-left align-middle  transition-all">
                <div className="p-4">
                  {loading ? (
                    <FilterMobileSkeleton />
                  ) : (
        <FilterMobile
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          onApplyFilters={handleApplyFilters}
          priceErrors={priceErrors}
          onPriceChange={onPriceChange}
        />
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
