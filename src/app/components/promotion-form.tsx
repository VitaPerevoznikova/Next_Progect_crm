'use client';

import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from './button';
import LogoUploader from './logo-uploader';
import InputField from './input-field';
import { createPromotion, getCompany } from '@/lib/api';

export type PromotionFieldValues = {
  title: string;
  description: string;
  discount: string | number;
};

const initialValues: PromotionFieldValues = {
  title: '',
  description: '',
  discount: '',
};

export interface PromotionFormProps {
  companyId: string;
  onSubmit?: (values: PromotionFieldValues) => void | Promise<void>;
}

export default function PromotionForm({
  companyId,
  onSubmit,
}: PromotionFormProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<any>(null);

  useEffect(() => {
    if (companyId) {
      setLoading(true);
      getCompany(companyId)
        .then((data) => {
          setCompany(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching company:', error);
          setLoading(false);
        });
    }
  }, [companyId]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotions', companyId],
      });

      queryClient.invalidateQueries({
        queryKey: ['promotions'],
        exact: true,
      });
    },
  });

  const handleSubmit = async (values: PromotionFieldValues) => {
    if (!company) {
      console.error('Company data not loaded');
      return;
    }

    await mutateAsync({
      ...values,
      discount: Number(values.discount) || 0,
      companyId: company.id,
      companyTitle: company.title,
    });

    if (onSubmit) {
      onSubmit(values);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form className="flex flex-col gap-10">
        <p className="mb-0.5 text-xl">Add new promotion</p>
        <div className="flex flex-col gap-5">
          <InputField required label="Title" placeholder="Title" name="title" />
          <InputField
            required
            label="Description"
            placeholder="Description"
            name="description"
          />
          <InputField
            required
            type="number"
            label="Discount"
            placeholder="Discount"
            name="discount"
          />
          <LogoUploader square label="Image" placeholder="Upload photo" />
        </div>
        <Button type="submit" disabled={isPending}>
          Add promotion
        </Button>
      </Form>
    </Formik>
  );
}